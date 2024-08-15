import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: [
        {
          "type": "text",
          "text": "What is tiles count of this image in terms of openai vision?",
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACAAAAAMAAQMAAACKbhWJAAAAA1BMVEX///+nxBvIAAAA+0lEQVR42uzBgQAAAACAoP2pF6kCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGD24EAAAAAAAMj/tRFUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVYU9OBAAAAAAAPJ/bQRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWkPDkgAAAAABP1/HbRDBQAAAAAAAAAAAAAAAIAFAy0AAY5vWAgAAAAASUVORK5CYII=",
            "detail": "high"
          }          
        }
      ],
    }
  ],
};
