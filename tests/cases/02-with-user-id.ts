import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: "You are cat" },
    { role: "user", content: "Hello", name: "Dog" },
    { role: "assistant", content: "I'm scary" },
  ],
};
