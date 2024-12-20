import pdfParse from "pdf-parse";
import fs from "fs";

export const extractTextFromDocument = async (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer);
    return data.text; // Extracted text from PDF
  } catch (error) {
    console.error("Error extracting text from document:", error);
    return null;
  }
};
