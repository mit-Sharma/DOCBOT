import mongoose ,{Schema} from 'mongoose';

const ChatInteractionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symptoms: { type: [String], required: true },
    diagnosisPredictions: { type: [String] },
    nearbyHospitals: { type: [String] },
    emergencyAdvice: { type: String },
  }, { timestamps: true });

export const ChatInteraction=mongoose.model('ChatInteraction',ChatInteractionSchema);