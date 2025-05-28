import fs from 'fs';
import path from 'path';

/**
 * Save content to a markdown file.
 * @param {string|string[]} content - The text content or array of strings to write.
 * @param {string} filePath - Full path including the desired filename, e.g. "data/ad.md".
 */
export default function saveToMd(content, filePath = 'output.md') {
  // Ensure content is a string
  let contentStr = '';
  if (Array.isArray(content)) {
    contentStr = content.join('\n\n');
  } else {
    contentStr = content;
  }

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(filePath, contentStr, 'utf8');
  console.log(`Saved content to ${filePath}`);
  return filePath;
}
