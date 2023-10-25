import { get } from "lodash";
import {
  createConversation,
  getConversationById,
  getConversations,
  getMessages,
} from "../controller/convController";
import { protect } from "./../controller/authController";
import express from "express";

const router = express.Router();

router.get("/", protect, getConversations);
router.post("/", protect, createConversation);
router.get("/:id", protect, getConversationById);
router.get("/:id/messages", protect, getMessages);
export default router;
