import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { estimateTokens } from "../src";

const tokensJsonPath = path.join(__dirname, "tokens.json");
const tokens: Record<string, number> = JSON.parse(
  fs.readFileSync(tokensJsonPath, "utf-8"),
);

describe.each(Object.entries(tokens))("Testing %s", (file, expectedTokens) => {
  const casePath = path.join(__dirname, "cases", file);
  const testCase: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming =
    require(casePath).default;

  test(`Expected: ${expectedTokens}`, () => {
    const estimatedTokens = estimateTokens(testCase);
    expect(estimatedTokens).toBe(expectedTokens);
  });
});
