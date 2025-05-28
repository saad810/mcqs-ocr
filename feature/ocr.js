import Together from "together-ai";
import { config } from "dotenv";
import fs from "fs";

config();


export default async function ocr({
    filePath,
    apiKey = process.env.TOGETHER_API_KEY,
    model = "Llama-3.2-90B-Vision"
}) {
    const visionLLM =
        model === "free"
            ? "meta-llama/Llama-Vision-Free"
            : `meta-llama/${model}-Instruct-Turbo`;

    const together = new Together({ apiKey });

    const extractedJSON = await getQuestionsJSON({ together, visionLLM, filePath });
    return extractedJSON;
}

async function getQuestionsJSON({ together, visionLLM, filePath }) {
    const systemPrompt = `Extract all multiple-choice questions from the image and convert them into a structured JSON format. Each item must include a "question" and an array of "options".

Rules:
- Only return valid multiple-choice questions.
- Do NOT include explanations, instructions, or any other text.
- The final output must be a valid JSON object like:
{
  "questions": [
    {
      "question": "What is the capital of France?",
      "options": ["Paris", "Berlin", "London", "Rome"]
    }
  ]
}
- Return only the JSON. No comments, markdown, or extra content.
`;

    const finalImageUrl = isRemoteFile(filePath)
        ? filePath
        : `data:image/jpeg;base64,${encodeImage(filePath)}`;

    const output = await together.chat.completions.create({
        model: visionLLM,
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: systemPrompt },
                    {
                        type: "image_url",
                        image_url: { url: finalImageUrl },
                    },
                ],
            },
        ],
    });

    return output.choices[0].message.content;
}

function encodeImage(imagePath) {
    const imageFile = fs.readFileSync(imagePath);
    return Buffer.from(imageFile).toString("base64");
}

function isRemoteFile(filePath) {
    return filePath.startsWith("http://") || filePath.startsWith("https://");
}
