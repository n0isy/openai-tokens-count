import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  model: "gpt-4-turbo",
  messages: [
    { role: "system", content: "Write OK if you understand" },
    { role: "user", content: "Hello" },
    { role: "assistant", content: "OK"},
    { role: "user", content: "Write me ok" },
  ],
}
