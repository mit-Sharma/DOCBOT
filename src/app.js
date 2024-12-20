import express from "express";

import cors from "cors";

import cookieParser from "cookie-parser";
const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json())

app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))

app.use(cookieParser());

import documentRouter from "./routes/documentRoutes.js";
app.use('/api/v1/document',documentRouter);

import chatRouter from "./routes/chatRoutes.js";
app.use('/api/v1/chats',chatRouter);

import userRouter from "./routes/userRoutes.js";
app.use('/api/v1/user',userRouter);


export default app