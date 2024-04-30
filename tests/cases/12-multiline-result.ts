import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  "model": "gpt-4-turbo",
  "messages": [{
    "role": "user",
    "content": "Calculate the area of a sphere with a radius of Earth",
  }, {
    "role": "assistant",
    "content": "To calculate the surface area of a sphere, you can use the formula:\n\n\\[ \\text{Area} = 4 \\pi r^2 \\]\n\nwhere \\( r \\) is the radius of the sphere. The average radius of Earth is approximately 6,371 kilometers.\n\nLet's calculate the surface area of Earth using this formula.",
    "tool_calls": [{
      "id": "call_9s5pnQ2ibO1yxf0gJoV6M0Mn",
      "type": "function",
      "function": {
        "name": "execute_javascript_code",
        "arguments": "{\"code\":\"const radius = 6371; // Earth's radius in kilometers\\nconst area = 4 * Math.PI * Math.pow(radius, 2);\\narea;\"}",
      },
    }],
  }, { "role": "tool", "content": "510064471.90978825", "tool_call_id": "call_9s5pnQ2ibO1yxf0gJoV6M0Mn" }],
  "max_tokens": 4096,
  "temperature": 0.14,
  "tools": [{
    "type": "function",
    "function": {
      "name": "execute_javascript_code",
      "description": "Execute Javascript code and returns result.",
      "parameters": {
        "type": "object",
        "properties": { "code": { "type": "string", "description": "javascript code" } },
        "required": ["code"],
      },
    },
  }],
};
