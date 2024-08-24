# openai-tokens-count
OpenAI tokens calculator, with function calls, images, and messages in one call

# Token Estimation

This package provides a utility function to estimate the token count for OpenAI chat completions.

## Installation

To install the package, run the following command:

```bash
npm install openai-tokens-count
```

## Usage

Here's an example of how to use the `estimateTokens` function:

```typescript
import { estimateTokens } from 'openai-tokens-count';
import OpenAI from "openai"; // for typings

const message: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello' }],
};

const run = async () => {
  const estimatedTokens = await estimateTokens(message);
  console.log('Estimated tokens:', estimatedTokens);
}

run();
```

The function returns the estimated token count for the given input.

## Advanced Usage

For a more complex scenario, including multiple messages, tool calls, various parameters, and image estimation, you can use the following example:

```typescript
import { estimateTokens } from 'openai-tokens-count';
import OpenAI from "openai"; // for typings

const advancedMessage: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
  model: "gpt-4-turbo",
  messages: [
    { role: "system", content: "You are a weather predictor" },
    { role: "user", content: "Hello! How cloudy is it in London?" },
    {
      role: "assistant",
      content: "",
      tool_calls: [
        {
          id: "call_w3cN5nYrqIbu6HLm7tYMP2OZ",
          type: "function",
          function: {
            name: "get_current_weather_by_coords",
            arguments: `{
              "coords": {
                "lat": "51.5074",
                "long": "-0.1278"
              },
              "unit": "celsius"
            }`
          }
        }
      ]
    },
    {
      role: "tool",
      content: '{ "temperature": 15, "condition": "cloudy" }',
      tool_call_id: "call_w3cN5nYrqIbu6HLm7tYMP2OZ",
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "What’s in this image?"
        },
        {
          type: "image_url",
          image_url: {
            url: "https://raw.githubusercontent.com/n0isy/openai-tokens-count/master/tests/__fixtures__/1t-512x512.png",
            detail: "high"
          }
        }
      ],
    }
  ],
  tools: [
    {
      type: "function",
      function: {
        name: "get_current_weather_by_coords",
        description: "Get the current weather by coordinates",
        parameters: {
          type: "object",
          properties: {
            coords: {
              type: "object",
              description: "(lat, long)",
              properties: {
                lat: { type: "string", description: "latitude" },
                long: { type: "string", description: "longitude" },
              },
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["coords"],
        },
      },
    }
  ],
};

const runAdvanced = async () => {
  const estimatedTokens = await estimateTokens(advancedMessage);
  console.log('Estimated tokens for advanced message:', estimatedTokens);
}

runAdvanced();
```

## Testing

To run the tests, use the following command:

```bash
npm test
```

The tests are defined in the `test/run.spec.ts` file. They use the Jest testing framework to run test cases and compare the estimated token counts with the expected values.

## Preparing Tests

To prepare test cases and generate the `tokens.json` file, follow these steps:

1. Create a directory named `test/cases` and add test case files inside it. Each test case file should export an object with the following properties:
    - `model` (string): The name of the OpenAI model to use for chat completion.
    - `messages` (array): An array of message objects, each containing a `role` and `content` property.

   Example test case file (`hello-world.ts`):
   ```typescript
   export default {
     model: 'gpt-4-turbo',
     messages: [{ role: 'user', content: 'Hello' }],
   };
   ```

2. Run the `tests/prepare-from-openai.ts` script to generate the `tokens.json` file:

   ```bash
   npm run makeTests
   ```

   This script reads all the test case files from the `test/cases` directory, sends them to the OpenAI API for chat completion, and saves the actual token counts in the `test/tokens.json` file.

3. The `tokens.json` file will be used by the tests to compare the estimated token counts with the actual values.

   Example `tokens.json` file:
   ```json
   {
     "hello-world.ts": 8
   }
   ```

Now you're ready to run the tests and verify the token estimation functionality.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This package is open-source and available under the [MIT License](LICENSE).
