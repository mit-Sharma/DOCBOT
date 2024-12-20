import { streamText } from "ai";
import { ChatInteraction } from "../models/ChatInteraction.js";
import { GoogleGenerativeAI } from "@google/generative-ai";







// Initialize OpenAI API
const google = new GoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY, 
  });


export const processChat = async (req, res) => {
  try {
    const { userId, symptoms, location } = req.body;

    if (!symptoms) {
      return res.status(400).json({ success: false, message: "Symptoms are required." });
    }
    const model = google.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt1= `Analyze the following symptoms and provide possible diagnoses: ${symptoms}`;
    // Step 1: Generate Diagnosis Predictions
    const diagnosisResponse=await model.generateContent(prompt1);
    const diagnosisPredictions=diagnosisResponse.response.text();
    

    // Step 2: Find Nearby Hospitals
    let nearbyHospitals = [];
    
    if (location) {
    const prompt2=`List three hospitals or clinics near ${location} for medical assistance.`
    const hospitalResponse =  await model.generateContent(prompt2);
    const nearbyHospitals=hospitalResponse.response.text();
    }

    // Step 3: Generate Emergency Advice
    const prompt3=`Provide emergency advice for the following symptoms: ${symptoms}`;
    const adviceResponse =  await model.generateContent(prompt3);
    const emergencyAdvice = adviceResponse.response.text();

    // Save Interaction to Database
    const interaction = new ChatInteraction({
      user: userId,
      symptoms,
      diagnosisPredictions,
      nearbyHospitals,
      emergencyAdvice,
    });

    await interaction.save();

    // Respond with Consolidated Data
    res.status(200).json({
      success: true,
      interaction: {
        symptoms,
        diagnosisPredictions,
        nearbyHospitals,
        emergencyAdvice,
      },
    });
  } catch (error) {
    console.error("Error in processChat:", error);
    res.status(500).json({ success: false, message: "An error occurred while processing the chat." });
  }
};
