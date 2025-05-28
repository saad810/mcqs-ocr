import Together from "together-ai";
import fs from "fs";
import { config } from "dotenv";
config(); // Load environment variables from .env file
const togetherApiKey = process.env.TOGETHER_API_KEY;
if (!togetherApiKey) {
    throw new Error("TOGETHER_API_KEY is not set in the environment variables.");
}
export default async function ocr({
    filePath,
    model = "Llama-3.2-90B-Vision",
}) {
    const visionLLM = model === "free" ? "meta-llama/Llama-Vision-Free" : `meta-llama/${model}-Instruct-Turbo`;

    const together = new Together({ togetherApiKey });

    const systemPrompt = `Convert the provided image into Markdown format. Ensure that all content from the page is included, such as headers, footers, subtexts, images (with alt text if possible), tables, and any other elements.

  Requirements:

  - Output Only Markdown: Return solely the Markdown content without any additional explanations or comments.
  - No Delimiters: Do not use code fences or delimiters like \`\`\`markdown.
  - Complete Content: Do not omit any part of the page, including headers, footers, and subtext.
  `;


    const finalImageUrl = isRemoteFile(filePath)
        ? filePath
        : `data:image/jpeg;base64,${encodeImage(filePath)}`;

    try {
        const response = await together.chat.completions.create({
            model: visionLLM,
            messages: [
                {
                    role: "system",
                    content: systemPrompt.trim(),
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: systemPrompt.trim() },
                        { type: "image_url", image_url: { url: finalImageUrl } },
                    ],
                },
            ],
        });

        const output = response.choices[0].message.content;
        // Optional: Log output for debugging
        // console.log("OCR Output:", output);
        return output;
    } catch (error) {
        console.error("Error fetching OCR:", error);
        throw error;
    }
}

function encodeImage(imagePath) {
    const imageFile = fs.readFileSync(imagePath);
    return Buffer.from(imageFile).toString("base64");
}

function isRemoteFile(filePath) {
    return filePath.startsWith("http://") || filePath.startsWith("https://");
}
