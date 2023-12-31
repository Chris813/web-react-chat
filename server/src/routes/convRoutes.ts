import { get } from "lodash";
import {
  createConversation,
  deleteConversationById,
  getConversationById,
  getConversations,
  getMessages,
  seenMessages,
  sendMessages,
} from "../controller/convController";
import { protect } from "./../controller/authController";
import express from "express";

const router = express.Router();

router.get("/", protect, getConversations);
router.get("/:id/messages", protect, getMessages);
router.post("/:id/messages", protect, sendMessages);
router.post("/:id/seen", protect, seenMessages);
router.get("/:id", protect, getConversationById);
router.delete("/:id", protect, deleteConversationById);
router.post("/", protect, createConversation);

export default router;
