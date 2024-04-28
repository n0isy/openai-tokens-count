import fs from "fs";
import OpenAI from "openai";
import path from "path";

async function prepareFromOpenAI() {
  const casesDir = path.join(__dirname, 'cases');
  const caseFiles = fs.readdirSync(casesDir);

  const openai = new OpenAI();
  const results: Record<string,number> = {};

  for (const file of caseFiles) {
    if (file.endsWith('.ts')) {
      const casePath = path.join(casesDir, file);
      console.log(casePath);
      const testCase = (await import(casePath)).default;

      const response = await openai.chat.completions.create(testCase);
      results[file] = response.usage?.prompt_tokens || 0;
      console.log(response.usage, response.choices?.[0]?.message);
    }
  }

  return results;
}

prepareFromOpenAI()
  .then((results) => {
    const serverJsonPath = path.join(__dirname, 'tokens.json');
    fs.writeFileSync(serverJsonPath, JSON.stringify(results, null, 2));
    console.log('Server JSON file created successfully.');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
