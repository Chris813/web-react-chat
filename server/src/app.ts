import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
config();
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

// 配置 Passport 初始化和会话支持
// app.use(passport.initialize());
// app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
const server = app.listen(process.env.PORT, () => {
  if (process.env.PORT == null || process.env.PORT == "") {
    process.env.PORT = "3000";
  }
  console.log(process.env.PORT);
  console.log("Server Running");
});
