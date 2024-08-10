import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { estimateTokens, getCachedEncoding, messageTokenCache, toolTokenCache } from "../src";

const tokensJsonPath = path.join(__dirname, "tokens.json");
const tokens: Record<string, number> = JSON.parse(
  fs.readFileSync(tokensJsonPath, "utf-8"),
);

describe.each(Object.entries(tokens))("Testing %s", (file, expectedTokens) => {
  const casePath = path.join(__dirname, "cases", file);
  const testCase: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming =
    require(casePath).default;

  test(`Expected: ${expectedTokens}`, () => {
    getCachedEncoding(testCase.model);

    const numRuns = 10; // Number of times to run the function
    const times: number[] = [];
    let estimatedTokens;
    for (let i = 0; i < numRuns; i++) {
      const startTime = process.hrtime();
      estimatedTokens = estimateTokens(testCase);
      const endTime = process.hrtime(startTime);
      const elapsedTime = endTime[0] * 1000 + endTime[1] / 1e6; // Convert to milliseconds
      times.push(elapsedTime);

      // Ensure the estimated tokens match the expected tokens in each run
    }

    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`Run: ${times.map( el => el.toFixed(3)).join(" ")} ms \ Average time: ${averageTime.toFixed(3)} ms. \ Messages in cache: ${messageTokenCache.size} \ ${toolTokenCache.size}`);
    if (expectedTokens) {
      expect(estimatedTokens).toBe(expectedTokens);
    }
  });
});
