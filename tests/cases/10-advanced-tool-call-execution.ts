import OpenAI from "openai";

export default <OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>{
  model: "gpt-4-turbo",
  messages: [
    {
      "role": "assistant",
      "content": "",
      "tool_calls": [
        {
          "id": "call_w3cN5nYrqIbu6HLm7tYMP2OZ",
          "type": "function",
          "function": {
            "name": "create_team",
            arguments: `{
  "teamName": "Game Development Team",
  "teamDescription": "A specialized team focused on developing a comprehensive and immersive game, covering all aspects from programming and design to sound and project management.",
  "assistants": [
    {
      "name": "Game Programmer",
      "description": "Responsible for writing and testing the code that makes the game run, utilizing languages like C++ and C#, and experienced with game engines like Unity or Unreal Engine.",
      "instructions": [
        "Develop and test game code according to design documents.",
        "Implement game mechanics and interfaces using the chosen game engine.",
        "Collaborate with designers and artists to integrate visuals and audio into the game.",
        "Optimize game performance for various platforms."
      ],
      "tools": [
        "Unity",
        "Unreal Engine"
      ]
    },
    {
      "name": "Game Artist/Designer",
      "description": "Focuses on the visual aspects of the game, including character design, environment design, and UI/UX design, skilled in graphic design software.",
      "instructions": [
        "Create and animate 2D and3D game assets.",
        "Design user interfaces and user experiences that are intuitive and visually appealing.",
        "Work closely with programmers to ensure assets are optimized for performance.",
        "Stay updated with the latest trends in game art and design."
      ],
      "tools": [
        "Adobe Photoshop",
        "Blender"
      ]
    },
    {
      "name": "Sound Engineer/Composer",
      "description": "Handles the game's audio component, including sound effects, background music, and voice-overs, proficient in audio editing software.",
      "instructions": [
        "Compose and produce background music that fits the game's theme and enhances player immersion.",
        "Create sound effects that are synchronized with game actions.",
        "Record and edit voice-overs for character dialogues and narrations.",
        "Ensure audio quality is maintained acrossdifferent output devices."
      ],
      "tools": [
        "FL Studio",
        "Audacity"
      ]
    },
    {
      "name": "Project Manager Producer",
      "description": "Oversees the projects progress, ensuring that the development process"
    }
  ]
}`
          }
        }
      ]
    },
    {
      role: "tool",
      content: '{ "ok": 1}',
      tool_call_id: "call_w3cN5nYrqIbu6HLm7tYMP2OZ",
    }
  ],
};
