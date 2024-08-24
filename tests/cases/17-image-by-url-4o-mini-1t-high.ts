import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: [
        {
          "type": "text",
          "text": "What’s in this image?"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "https://raw.githubusercontent.com/n0isy/openai-tokens-count/master/tests/__fixtures__/1t-512x512.png",
            "detail": "high"
          }          
        },
      ],
    }
  ],
};
