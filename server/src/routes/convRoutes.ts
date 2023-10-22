import { createConversation } from "../controller/convController";
import { protect } from "./../controller/authController";
import express from "express";

const router = express.Router();

router.post("/", protect, createConversation);
export default router;
