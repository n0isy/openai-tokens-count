import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  model: "gpt-4-turbo",
  messages: [
    {
      role: "assistant",
      content: "",
      tool_calls: [
        {
          id: "call_eyMooCY0fH76vcpRSzHyy4m5",
          type: "function",
          function: {
            name: "create_team",
            arguments: '{"teamName":"Game Development Team", "description":"Team1"}',
          },
        },
        {
          id: "call_eyMooCY0fH76vcpRSzHyy4m6",
          type: "function",
          function: {
            name: "create_team",
            arguments: '{"teamName":"Game Development Team 2"}',
          },
        },
      ],
    },
    {
      role: "tool",
      content: '"Team successfully saved."',
      tool_call_id: "call_eyMooCY0fH76vcpRSzHyy4m5",
    },
    {
      role: "tool",
      content: '"Team successfully saved."',
      tool_call_id: "call_eyMooCY0fH76vcpRSzHyy4m6",
    },
  ],
};
