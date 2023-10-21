import express from "express";

import {
  login,
  register,
  gitCallback,
  getSocialToken,
} from "../controller/authController";

const CLIENT_URL = "http://localhost:5173/chat";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/login/error", (req, res) => {
  res.status(401).json({
    status: "fail",
    msg: "第三方授权失败",
  });
});

router.get("/socialToken", getSocialToken);

// router.get("/logout", (req, res) => {
//   req.logout()
//   res.redirect(CLIENT_URL);
// });

// router.get("/github", githubLogin);
router.get("/github/callback", gitCallback);

// router.get("/google", (req, res, next) => {
//   console.log("google");
//   passport.authenticate("google", { scope: ["profile"] });
//   next();
// });

// router.get("/google/callback", (req, res, next) => {
//   console.log("google callback");
//   passport.authenticate("google", {
//     failureRedirect: "/login/error",
//     successRedirect: CLIENT_URL,
//   });
//   next();
// });

export default router;
