import express from "express";
import { generateGeminiResponse } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/chat", generateGeminiResponse);

export default aiRouter;