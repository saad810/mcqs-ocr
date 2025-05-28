import fs from "fs";
import path from "path";
import Together from "together-ai";
import nodemailer from "nodemailer";
import { Parser as Json2csvParser } from "json2csv";
import ExcelJS from "exceljs";
import { pdfToImages } from "./pdfToImages";

export async function extractMcqsFromPdf({
  pdfPath,
  email,
  apiKey = process.env.TOGETHER_API_KEY,
  model = "Llama-3.2-90B-Vision",
}) {
  const visionLLM =
    model === "free"
      ? "meta-llama/Llama-Vision-Free"
      : `meta-llama/${model}-Instruct-Turbo`;

  const together = new Together({ apiKey });

  const imagePaths = await pdfToImages(pdfPath);

  let allQuestions = [];

  for (const imagePath of imagePaths) {
    const questions = await extractQuestionsAsJson(imagePath, together, visionLLM);
    allQuestions = allQuestions.concat(questions);
  }

  const csvPath = await saveToCsv(allQuestions);
  const excelPath = await saveToExcel(allQuestions);

  await sendEmail({
    to: email,
    subject: "MCQ Extraction Complete ✅",
    text: `The extraction is complete. Attached are the MCQs in CSV and Excel format.`,
    attachments: [
      { filename: "mcqs.csv", path: csvPath },
      { filename: "mcqs.xlsx", path: excelPath },
    ],
  });

  return allQuestions;
}
