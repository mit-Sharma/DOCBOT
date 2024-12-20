import { Document } from "../models/Document.js"; // Assuming you have a Document model
import { extractTextFromDocument } from "../utils/extractTextFromDocument.js"; // Utility function to extract text from uploaded document
import axios from "axios";

// Example AI function for calling Gemini API
const callAIAnalysisService = async (text) => {
  try {
    const response = await axios.post('https://generative-ai.googleapis.com/v1beta2/models/gemini-1.5-pro-latest:generateText', {
      headers: {
        'Authorization': `Bearer ${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`, // Use the correct API key
        'Content-Type': 'application/json',
      },
      data: {
        prompt: `Analyze the following medical document and provide possible analysis such as severity, dosage instructions, and next steps: ${text}`,
        max_tokens: 150,
        temperature: 0.7,
      }
    });

    // Assuming the response has the following structure
    return {
      severity: response.data.choices[0].text.includes("severity") ? "Moderate" : "Unknown",
      dosage: response.data.choices[0].text.includes("dosage") ? "Take 2 tablets daily" : "Unknown",
      nextSteps: response.data.choices[0].text.includes("next steps") ? "Follow up in 1 week" : "Unknown",
    };
  } catch (error) {
    throw new Error('Failed to call Gemini AI analysis service');
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { userId } = req.body;
    const filePath = req.file.path;

    // Step 1: Save the document in the database
    const document = new Document({ user: userId, filePath });
    await document.save();

    // Step 2: Extract text from the uploaded document
    const extractedText = await extractTextFromDocument(filePath); // Implement this utility to extract text (e.g., PDF, image to text)

    if (!extractedText) {
      return res.status(400).json({ success: false, message: 'Failed to extract text from document.' });
    }

    // Step 3: Call the Gemini AI analysis service with the extracted text
    const analysisResults = await callAIAnalysisService(extractedText);

    // Step 4: Store AI results in the document
    document.analysis = analysisResults;
    await document.save();

    // Step 5: Respond with the document and analysis
    res.status(201).json({ success: true, document });
  } catch (error) {
    console.error("Error in uploadDocument:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


