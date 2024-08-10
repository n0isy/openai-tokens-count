import { getEncoding, getEncodingNameForModel, Tiktoken, TiktokenModel } from "js-tiktoken";
import { LRUCache } from "lru-cache";
import murmurhash from "murmurhash";
import OpenAI from "openai";
import { formatArguments } from "./argument-format";
import { formatFunctionDefinitions } from "./function-format";
import { formatToolContent, tryFormatJSON } from "./tool-content-format";

type Message = OpenAI.Chat.ChatCompletionMessageParam;
type Tools = Array<OpenAI.Chat.ChatCompletionTool>;

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

function estimateTokens(
  request: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
): number {
  const messages = request.messages;
  const tools = request.tools;
  const toolChoice = request.tool_choice;
  const chatModel = request.model;

  let tokens = 0;
  tokens += estimateTokensInMessages(chatModel, messages, tools);

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

function estimateTokensInTools(chatModel: string, tools: Tools): number {
  const toolsHash = murmurhash.v3(JSON.stringify(tools)).toString();
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

function estimateTokensInMessages(
  chatModel: string,
  messages: Message[],
  tools?: Tools,
): number {
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

    tokens += estimateTokensInMessage(chatModel, msg, 1);
  }

  tokens += 3; // Each completion (vs message) seems to carry a 3-token overhead

  return tokens;
}

function estimateTokensInMessage(
  chatModel: string,
  message: Message,
  toolMessageSize: number,
): number {
  const messageHash = murmurhash.v3(JSON.stringify(message)).toString();
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
      } else if (item.type === "image_url") {
        // TODO: Estimate tokens for image URL based on detail level
        // ...
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

export { estimateTokens, getCachedEncoding, estimateTokensInMessages, estimateTokensInTools, messageTokenCache, toolTokenCache };
