import { get } from "lodash";
import {
  createConversation,
  getConversationById,
  getConversations,
  getMessages,
  sendMessages,
} from "../controller/convController";
import { protect } from "./../controller/authController";
import express from "express";

const router = express.Router();

router.get("/", protect, getConversations);
router.get("/:id/messages", protect, getMessages);
router.post("/:id/messages", protect, sendMessages);
router.get("/:id", protect, getConversationById);
router.post("/", protect, createConversation);

export default router;
