import express from "express"

import { register } from "../controllers/sign-upController.js"
import { login } from "../controllers/sign-inController.js"

const userRouter=express.Router();
userRouter.post("/register",register);
userRouter.post("/login",login);
export default userRouter;