import express from "express";
import {
  getAllUsers,
  getCurrentUser,
  setAvatar,
} from "../controller/userController";
import { protect } from "../controller/authController";
const router = express.Router();

router.get("/me", getCurrentUser);
router.post("/avatar", setAvatar);
router.get("/allusers/:id", protect, getAllUsers);
export default router;
