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
            arguments: `{"teamName":"Game Development Team",
      "tools": [
        "Unity",
        "Unreal Engine",
        "3rd Party"
      ],
      "assistants": [{
      "name": "Game Programmer",
      "instructions": [
        "Develop and test game code according to design documents.",
        "Implement game mechanics and interfaces using the chosen game engine.",
        "Collaborate with designers and artists to integrate visuals and audio into the game.",
        "Optimize game performance for various platforms."
      ],
      "scoring": [1,2,3,4],
      "default_score": 3
      }]}`,
          },
        },
      ],
    },
    {
      role: "tool",
      content: '{ "ok": 1}',
      tool_call_id: "call_eyMooCY0fH76vcpRSzHyy4m5",
    },
  ],
};
