import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  "model": "gpt-4-turbo",
  "messages": [{ "role": "user", "content": "Calculate the area of a sphere with a radius of Earth" }],
  "tools": [{
    "type": "function",
    "function": {
      "name": "execute_javascript_code",
      "description": "Execute Javascript code and returns result.\n\nExample:\n\nexecute_js('10+10'), returns '100'",
      "parameters": {
        "type": "object",
        "properties": { "code": { "type": "string", "description": "javascript code" } },
        "required": ["code"],
      },
    },
  }],
};
