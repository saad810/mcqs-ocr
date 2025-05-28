import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pdf-poppler";

const pdf = pkg;

// ES Module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function pdfToImages(pdfPath) {
    console.log("Converting PDF to images...", pdfPath);
    const outputDir = path.join(__dirname, '..', "pdf-images");
    fs.mkdirSync(outputDir, { recursive: true });

    const options = {
        format: "jpeg",
        out_dir: outputDir,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: null,
    };

    // const converter = new Converter(pdfPath, options);
    // await converter.convert();
    await pdf.convert(pdfPath, options);

    return fs
        .readdirSync(outputDir)
        .filter((file) => file.endsWith(".jpg"))
        .map((file) => path.join(outputDir, file));
}
