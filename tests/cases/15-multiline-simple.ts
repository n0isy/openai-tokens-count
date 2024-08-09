import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  "model": "gpt-3.5-turbo",
  "messages": [{
    "role": "assistant",
    "content": "RUN ME",
    "tool_calls": [{
      "id": "call_J8DL6oHwvU44WK0VSisfCdFp",
      "type": "function",
      "function": {
        "name": "execute_code",
        "arguments": "{}",
      },
    }],
  }, {
    "role": "tool",
    "content": "42",
    "tool_call_id": "call_J8DL6oHwvU44WK0VSisfCdFp",
  }]
};
