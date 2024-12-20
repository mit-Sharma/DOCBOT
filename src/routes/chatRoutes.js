import express from "express"
import { processChat } from "../controllers/chatController.js"
import { authenticateJWT } from "../middleware/authMiddleware.js"

const chatRouter=express.Router();
chatRouter.post('/chat',authenticateJWT,processChat);

export default chatRouter