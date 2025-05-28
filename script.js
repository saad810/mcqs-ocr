import { safeJSON } from "together-ai/core.mjs";
import ocr from "./feature/ocr.js";
import pdfToImages from "./utils/convertToImages.js";
import { appendToJsonFile } from "./utils/saveFromJson.js";
import saveToMd from "./utils/saveToMd.js";
// appendToJsonFile
// safeJSON
import path from "path"; // for extracting filename

const filepaths = [
    "./books/oetp-limits.pdf",
    "./books/ch1-torcia.pdf",
    "./books/kips-ecat-limits.pdf",
];

try {
    for (const filepath of filepaths) {
        console.log(`Processing file: ${filepath}`);

        const filenameWithoutExt = path.basename(filepath, path.extname(filepath));
        const images = await pdfToImages(filepath);
        console.log(`Converted PDF to ${images.length} images.`);

        const allExtractedData = [];

        const startTime = new Date();
        console.log("Starting OCR processing...");

        for (const file of images) {
            try {
                console.log("Processing image:", file);
                const data = await ocr({ filePath: file });
                allExtractedData.push(data);
            } catch (error) {
                console.error("Error processing image:", file, error);
            }
        }
        const endTime = new Date();
        console.log(`OCR processing completed in ${((endTime - startTime) / 1000).toFixed(2)} seconds.`);
        
        await appendToJsonFile(`logs/time.json`, {
            filename: filenameWithoutExt,
            timeTaken: ((endTime - startTime) / 1000).toFixed(2),
            imagesProcessed: images.length,
        });


        // Save all extracted data to a markdown file
        saveToMd(allExtractedData, `data/${filenameWithoutExt}.md`);
        console.log(`Saved extracted data to data/${filenameWithoutExt}.md`);
    }
} catch (error) {
    console.error("Error during PDF processing:", error);
}
