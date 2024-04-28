import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  model: "gpt-4-turbo",
  messages: [
    { role: "system", content: "You are weather predictor" },
    { role: "user", content: "Hello! How cloudy in London?" },
  ],
  tools: [
    {
      type: "function",
      function: {
        name: "get_current_weather_by_coords",
        description: "Get the current weather by coords struct",
        parameters: {
          type: "object",
          properties: {
            coords: {
              type: "object",
              description: "(lat,long)",
              properties: {
                lat: { type: "string", description: "latitude" },
                long: { type: "string", description: "longitude" },
              },
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["coords"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "get_coords",
        description: "Get coords by location name",
        parameters: {
          type: "object",
          properties: {
            location_name: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
          },
          required: ["location_name"],
        },
      },
    },
  ],
};
