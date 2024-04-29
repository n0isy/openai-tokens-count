import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  "model": "gpt-3.5-turbo",
  "messages": [{
    "role": "user",
    "content": "Hello. Please Build my 4 person game-developer team",
  }],
  "tools": [{
    "type": "function", "function": {
      "name": "create_team",
      "description": "Create and configure a team-set",
      "parameters": {
        "type": "object", "properties": {
          "assistants": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "description": {
                  "type": "string",
                  "description": "Brief description of the Assistant role",
                },
                "name": {
                  "type": "string",
                  "description": "Assistant name",
                }
              },
              "required": ["description"],
            },
            "description": "Configuration details of each Assistant in the team.",
          },
        }, "required": ["assistants"],
      },
    },
  }]
};
