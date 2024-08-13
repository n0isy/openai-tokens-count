export const schemas = {
  title: "Tool Schema",
  type: "array",
  items: {
    type: "object",
    properties: {
      function: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          parameters: { type: "object" },
        },
        required: ["name"],
      },
      type: { type: "string", enum: ["function"] },
    },
    required: ["function", "type"],
  },
};

export const messageSchema = {
  title: "Message Schema",
  type: "object",
  properties: {
    role: { type: "string" },
    content: {
      oneOf: [
        {
          "type": "string",
        },
        {
          type: "array",
          items: {
            oneOf: [
              {
                "type": "string",
              },
              {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["text"] },
                  text: { type: "string" },
                },
                required: ["type", "text"],
              },
              {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["image_url"] },
                  image_url: {
                    type: "object",
                    properties: {
                      url: { type: "string" },
                      detail: { type: "string" },
                    },
                    required: ["url", "detail"],
                  },
                },
                required: ["type", "image_url"],
              },
            ],
          },
        },
        
      ]
    },
    refusal: { type: ["string", "null"] },
    name: { type: "string" },
    tool_calls: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          function: {
            type: "object",
            properties: {
              name: { type: "string" },
              arguments: { type: "string" },
            },
            required: ["name", "arguments"],
          },
          type: { type: "string", enum: ["function"] },
        },
        required: ["id", "function", "type"],
      },
    },
  },
  required: ["role"],
};
