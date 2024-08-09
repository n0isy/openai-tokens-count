import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  "model": "gpt-4-turbo",
  "messages": [{
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
  }, { "role": "tool", "content": "5050", "tool_call_id": "call_taVzoK0TXghuCP34CiXvQnaY" }, {
    "role": "assistant",
    "content": "The sum of the first 100 natural numbers is 5050.",
  }, { "role": "user", "content": "sum of first 100 natural numbers" }, {
    "role": "assistant",
    "content": "",
    "tool_calls": [{
      "id": "call_EST7IQkcu4jgjCgTfNR40COR",
      "type": "function",
      "function": {
        "name": "execute_javascript_code",
        "arguments": "{\"code\":\"const n = 100;\\nconst sum = (n * (n + 1)) / 2;\\nsum;\"}",
      },
    }],
  }, { "role": "tool", "content": "5050", "tool_call_id": "call_EST7IQkcu4jgjCgTfNR40COR" }],
  "tools": [{
    "type": "function",
    "function": {
      "name": "execute_javascript_code",
      "description": "Execute Javascript code and returns result. Your code will be running like this:\nconst context = {};\nvm.createContext(context);\nresult = vm.runInContext(code, context);\nPlease don't use require or imports.\nExample: execute_js('10+10'), returns '100'",
      "parameters": {
        "type": "object",
        "properties": { "code": { "type": "string", "description": "javascript code" } },
        "required": ["code"],
      },
    },
  }]
};
