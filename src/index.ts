import { getEncoding, getEncodingNameForModel, Tiktoken, TiktokenModel } from "js-tiktoken";
import { LRUCache } from "lru-cache";
import murmurhash from "murmurhash";
import OpenAI from "openai";
import { formatArguments } from "./argument-format";
import { formatFunctionDefinitions } from "./function-format";
import { formatToolContent, tryFormatJSON } from "./tool-content-format";
import fastJson from 'fast-json-stringify';
import { messageSchema, schemas } from "./schemas";
import sharp from "sharp";
import { getFixedPrice, getTilePrice, longSideLimit, shortSideLimit, tileSize } from "./vision-constants";

// Create stringifiers
const stringifyTools = fastJson(schemas);
const stringifyMessage = fastJson(messageSchema);

// Global cache for encoding objects
const encodingCache = new Map<string, Tiktoken>();

// Global caches for token counts
const messageTokenCache = new LRUCache<string, number>({ max: 1000000 });
const toolTokenCache = new LRUCache<string, number>({ max: 1000000 });

function getCachedEncoding(model: string): Tiktoken {
  const encodingName = model.startsWith('gpt-4o') ? "o200k_base" : getEncodingNameForModel(model as TiktokenModel);
  if (!encodingCache.has(encodingName)) {
    const encoding = getEncoding(encodingName);
    encodingCache.set(encodingName, encoding);
  }
  return encodingCache.get(encodingName)!;
}

async function estimateTokens(
  request: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
): Promise<number> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = request.messages;
  const tools = request.tools;
  const toolChoice = request.tool_choice;
  const chatModel = request.model;

  let tokens = 0;
  tokens += await estimateTokensInMessages(chatModel, messages, tools);

  if (tools) {
    tokens += estimateTokensInTools(chatModel, tools);
  }

  if (tools && messages.some((msg) => msg.role === "system")) {
    tokens -= 4;
  }

  if (toolChoice && toolChoice !== "auto") {
    if (toolChoice === "none") {
      tokens += 1;
    } else if (typeof toolChoice === "object") {
      const tc = toolChoice as OpenAI.Chat.ChatCompletionNamedToolChoice;
      if (tc.function?.name) {
        tokens += countTokens(getCachedEncoding(chatModel), tc.function.name) + 4;
      }
    }
  }

  return tokens;
}

function estimateTokensInTools(chatModel: string, tools: OpenAI.Chat.ChatCompletionTool[]): number {
  const toolsHash = murmurhash.v3(stringifyTools(tools)).toString();
  const cacheKey = `${chatModel}-${toolsHash}`;

  if (toolTokenCache.has(cacheKey)) {
    return toolTokenCache.get(cacheKey)!;
  }

  const definitions = formatFunctionDefinitions(tools);
  let tokens = countTokens(getCachedEncoding(chatModel), definitions);
  tokens += 2; // Additional tokens for function definition of tools

  toolTokenCache.set(cacheKey, tokens);
  return tokens;
}

async function estimateTokensInMessages(
  chatModel: string,
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  tools?: OpenAI.Chat.ChatCompletionTool[],
): Promise<number> {
  let tokens = 0;

  let paddedSystem = false;

  for (const message of messages) {
    const msg = { ...message };

    if (msg.role === "system" && tools && !paddedSystem) {
      if (typeof msg.content === "string") {
        msg.content += "\n";
      }
      paddedSystem = true;
    }

    tokens += await estimateTokensInMessage(chatModel, msg, 1);
  }

  tokens += 3; // Each completion (vs message) seems to carry a 3-token overhead

  return tokens;
}

async function estimateTokensInMessage(
  chatModel: string,
  message: OpenAI.Chat.ChatCompletionMessageParam,
  toolMessageSize: number,
): Promise<number> {
  const messageHash = murmurhash.v3(stringifyMessage(message)).toString();
  const cacheKey = `${chatModel}-${messageHash}`;

  if (messageTokenCache.has(cacheKey)) {
    return messageTokenCache.get(cacheKey)!;
  }

  let tokens = 0;
  const encoding = getCachedEncoding(chatModel);
  tokens += countTokens(encoding, message.role);

  if (message.role === "tool") {
    if (toolMessageSize === 1) {
      tokens += countTokens(encoding, message.content as string);
    } else {
      tokens += countTokens(encoding, formatToolContent(message.content));
      const contentJSON = tryFormatJSON(message.content as string);
      if (contentJSON) {
        tokens -= Object.keys(contentJSON).length;
      }
    }
  } else if (typeof message.content === "string") {
    tokens += countTokens(encoding, message.content);
  } else if (Array.isArray(message.content)) {
    for (const item of message.content) {
      if (item.type === "text") {
        tokens += countTokens(encoding, item.text);
      } else if (item.type === "image_url" && item.image_url) {
        tokens += await countImageTokens(item, chatModel);
      }
    }
  }
  // OpenAI bug
  if (
    (message as unknown as { name: string }).name &&
    message.role !== "tool"
  ) {
    tokens += countTokens(encoding, message.name) + 1; // +1 for the name
  }

  if (message.role === "assistant" && message.tool_calls) {
    tokens += 2;
    for (const toolCall of message.tool_calls) {
      tokens += 3;
      tokens += countTokens(encoding, toolCall.type);
      if (toolCall.type === "function") {
        if (toolCall.function?.name) {
          const nameToken = countTokens(encoding, toolCall.function.name);
          tokens += nameToken * 2;
        }
        if (toolCall.function.arguments && toolCall.function.arguments !== "{}") {
          // console.log(JSON.stringify(formatArguments(toolCall.function.arguments)));
          tokens += countTokens(
            encoding,
            formatArguments(toolCall.function.arguments),
          );
        }
      }
    }

    if (message.tool_calls.length > 1) {
      tokens += 15; // s1, add delta when multi tools is added
      tokens -= message.tool_calls.length * 5 - 6; // s2
    } else {
      tokens -= 2; // s1, s2
    }
  }

  if (message.role === "tool") {
    tokens += 2; // add 2 if role is "tool"
  } else {
    tokens += 3; // Add three per message
  }

  messageTokenCache.set(cacheKey, tokens);
  return tokens;
}

function countTokens(encoding: Tiktoken, text: string | undefined): number {
  if (!text) return 0;

  return encoding.encode(text).length;
}

async function countImageTokens(contentPart: OpenAI.Chat.ChatCompletionContentPartImage, chatModel: string): Promise<number> {
  if (contentPart.image_url?.detail === 'low') {    
    return getFixedPrice(chatModel);
  }

  const { width, height } = await getImageSize(contentPart.image_url?.url);

  const longSide = Math.max(width, height);
  const scaleFactor1 = (longSide > longSideLimit) ? longSide / longSideLimit : 1;

  const shortSide = Math.min(width, height);
  const scaleFactor2 = (shortSide / scaleFactor1 > shortSideLimit) 
    ? (shortSide / scaleFactor1) / shortSideLimit : 1;

  const scaleFactor = scaleFactor1 * scaleFactor2;
  
  const scaledWidth = Math.floor(width / scaleFactor);
  const scaledHeight = Math.floor(height / scaleFactor);

  const tilesCount = Math.ceil(scaledWidth / tileSize) * Math.ceil(scaledHeight / tileSize);

  return getFixedPrice(chatModel) + tilesCount * getTilePrice(chatModel);;
}

async function getImageSize(url: string): Promise<{width: number, height: number}> {
  let imageBuffer;

  if (url.startsWith('data:')) {
    const uri = url.split(';base64,').pop() as string;
    imageBuffer = Buffer.from(uri, 'base64');
  }

  if (url.startsWith('https:') || url.startsWith('http:')) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  }

  if (!imageBuffer) {
    throw new Error('imageBuffer is not defined');
  }

  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  const { width, height } = metadata;

  if (!width || !height) {
    throw new Error('unprocessable image - no size availble');
  }

  return { width, height };
}

export { estimateTokens, getCachedEncoding, estimateTokensInMessages, estimateTokensInTools, messageTokenCache, toolTokenCache };
