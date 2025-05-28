import fs from 'fs';
import path from 'path';

export function appendToJsonFile(relativePath, newData) {
  try {
    const fullPath = path.resolve(relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    let existingData = [];

    if (fs.existsSync(fullPath)) {
      const raw = fs.readFileSync(fullPath, 'utf8');
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          existingData = parsed;
        } else {
          existingData = [parsed];
        }
      } catch (e) {
        console.warn("⚠️ Couldn't parse existing JSON. Starting fresh.");
      }
    }

    // Ensure new data is added properly
    if (Array.isArray(newData)) {
      existingData.push(...newData);
    } else {
      existingData.push(newData);
    }

    fs.writeFileSync(fullPath, JSON.stringify(existingData, null, 2), 'utf8');
    console.log(`✅ Appended data to ${fullPath}`);
  } catch (err) {
    console.error("❌ Error appending to JSON file:", err);
  }
}
