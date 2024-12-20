import express from "express"
import { uploadDocument } from "../controllers/documentController.js"
import { authenticateJWT } from "../middleware/authMiddleware.js"
import { upload } from "../middleware/fileUploadMiddleware.js"

const documentRouter=express.Router();
documentRouter.post("/upload",authenticateJWT,upload.single('document'),uploadDocument);

export default documentRouter