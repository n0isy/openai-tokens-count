import OpenAI from "openai";

const originalMessages = [
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
    {
      "role": "user",
      "content": "Calculate the area of a sphere with a radius of Earth",
    }, {
      "role": "assistant",
      "content": "To calculate the surface area of a sphere, you can use the formula:\n\n\\[ \\text{Area} = 4 \\pi r^2 \\]\n\nwhere \\( r \\) is the radius of the sphere.\n\nThe average radius of the Earth is approximately 6,371 kilometers. Let's calculate the surface area of the Earth using this formula.",
      "tool_calls": [{
        "id": "call_J8DL6oHwvU44WK0VSisfCdFp",
        "type": "function",
        "function": {
          "name": "execute_javascript_code",
          "arguments": "{\"code\":\"const radius = 6371; // Earth's radius in kilometers\\nconst area = 4 * Math.PI * Math.pow(radius, 2); // Surface area formula\\narea;\"}",
        },
      }],
    }, {
      "role": "tool",
      "content": "510064471.90978825",
      "tool_call_id": "call_J8DL6oHwvU44WK0VSisfCdFp",
    }, { "role": "user", "content": "sum of first 100 natural numbers" }, {
      "role": "assistant",
      "content": "",
      "tool_calls": [{
        "id": "call_taVzoK0TXghuCP34CiXvQnaY",
        "type": "function",
        "function": {
          "name": "execute_javascript_code",
          "arguments": "{\"code\":\"const n = 100;\\nconst sum = (n * (n + 1)) / 2;\\nsum;\"}",
        },
      }],
    }, { "role": "tool", "content": "5050", "tool_call_id": "call_taVzoK0TXghuCP34CiXvQnaY" }];

// Repeat the messages array 10000 times
const repeatedMessages = Array(10000).fill(originalMessages).flat();

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  model: "gpt-4o",
  messages: repeatedMessages,
};
