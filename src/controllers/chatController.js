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

    // Step 1: Generate Diagnosis Predictions
    const diagnosisResponse = streamText({
      model: google('gemini-1.5-pro-latest'),
      prompt: `Analyze the following symptoms and provide possible diagnoses: ${symptoms}`,
      max_tokens: 150,
    });
    const diagnosisPredictions = diagnosisResponse.data.choices[0].text.trim().split("\n").filter(Boolean);

    // Step 2: Find Nearby Hospitals
    let nearbyHospitals = [];
    if (location) {
      const hospitalResponse =  streamText({
        model: google('gemini-1.5-pro-latest'),
        prompt: `List three hospitals or clinics near ${location} for medical assistance.`,
        max_tokens: 100,
      });
      nearbyHospitals = hospitalResponse.data.choices[0].text.trim().split("\n").filter(Boolean);
    }

    // Step 3: Generate Emergency Advice
    const adviceResponse = streamText({
      model:google('gemini-1.5-pro-latest'),
      prompt: `Provide emergency advice for the following symptoms: ${symptoms}`,
      max_tokens: 150,
    });
    const emergencyAdvice = adviceResponse.data.choices[0].text.trim();

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
