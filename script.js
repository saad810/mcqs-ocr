
import ocr from "./feature/ocr.js";
import pdfToImages from "./utils/convertToImages.js";
import { appendToJsonFile } from "./utils/saveFromJson.js";

// console.time("OCR Processing Time");

const extractedData = [];

const filepath = "./books/ch1-torcia.pdf";
try {
    const files = await pdfToImages(filepath);
    console.log("PDF converted to images:", files);
    for (const file of files) {
        const extractedData = await ocr({
            filePath: file,
        });
        console.log("Extracted Data:", extractedData);
        if (extractedData && extractedData.questions) {
            extractedData.push(...extractedData.questions);
        } else {
            console.warn("No questions found in:", file);
        }
        // save to json file
        appendToJsonFile("./data/limits-functions.json", extractedData);

    }
} catch (error) {
    console.error("Error during PDF processing:", error);
}