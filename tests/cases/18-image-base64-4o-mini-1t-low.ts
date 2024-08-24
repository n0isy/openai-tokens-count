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
            "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf8AAAH/CAYAAABZ8dS+AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAACBhJREFUeF7t1TEBACAMwLCBf8/AgYsmTyV0nWcAgIz9CwBEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AMSYPwDEmD8AxJg/AKTMXNedB/r8C3nWAAAAAElFTkSuQmCC",
            "detail": "low"
          },
        },
      ],
    }
  ],
};
