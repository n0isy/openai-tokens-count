import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "user",
      content: "Hello. Please Build my 4 person game-developer team",
    },
  ],
  tools: [
    {
      type: "function",
      function: {
        name: "create_team",
        description: "Create and configure a team-set",
        parameters: {
          type: "object",
          properties: {
            assistants: {
              type: "array",
              items: { type: "string" },
              description:
                "Assistant role. Each element of array is one assistant",
            },
          },
          required: ["assistants"],
        },
      },
    },
  ],
};
