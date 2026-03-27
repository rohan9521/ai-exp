import ollama from "ollama";
import { PlanSchema, Plan } from "../schemas/plan.schema.js";
const SYSTEM_PROMPT = `
You are a senior React engineer AI.

Return ONLY valid JSON.

STRICT FORMAT:

{
  "repo": "project-name-kebab-case",
  "folders": ["public", "src", "src/components"],
  "files": [
    {
      "path": "package.json",
      "content": "{...}"
    }
  ],
  "commands": ["npm install"]
}

RULES:
- Generate a COMPLETE runnable React application using Vite.
- Include everything needed to run the app:
  - package.json
  - index.html
  - vite.config.js or vite.config.ts
  - src/main.jsx or src/main.tsx
  - src/App.jsx or src/App.tsx
  - at least one stylesheet
- Use modern React with functional components.
- Make the app feel polished, not a toy example.
- Commands should be safe and minimal. Prefer ONLY:
  - "npm install"
  - optionally "npm install <package>"
- Do not use create-react-app or npx scaffolding commands.
- The files must fully define the project without relying on a generator.
- "files" MUST be an array of objects
- Each file MUST have:
  - "path" (string)
  - "content" (string)
- DO NOT return strings in files array
- DO NOT return markdown
- DO NOT return explanation
- ONLY JSON
`;

export async function generatePlan(prompt: string): Promise<Plan> {
  const response = await ollama.chat({
    model: "qwen2.5-coder",
    format: "json",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Build a complete React project for this request: ${prompt}`
      }
    ]
  });

  const parsed = JSON.parse(response.message.content);

  return PlanSchema.parse(parsed);
}
