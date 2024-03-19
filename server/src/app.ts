import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";
import { config } from "dotenv";
config();
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import convRoutes from "./routes/convRoutes";
const app = express();

// 配置 Passport 初始化和会话支持
// app.use(passport.initialize());
// app.use(passport.session());

let client_url;
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV == "development") {
  client_url = process.env.DEV_CLIENT_URL;
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );
} else {
  client_url = process.env.PROD_CLIENT_URL;
}
console.log(client_url);
app.use(
  cors({
    origin: client_url,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(express.json({ limit: "50mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/conversations", convRoutes);
const server = app.listen(process.env.PORT, () => {
  if (process.env.PORT == null || process.env.PORT == "") {
    process.env.PORT = "3000";
  }
  console.log(process.env.PORT);
  console.log("Server Running");
});

//socket.io服务器
export const io = new Server(server, {
  cors: {
    origin: client_url,
    credentials: true,
  },
});
let Users = new Map();
io.on("connection", (socket) => {
  socket.on("add-user", (data) => {
    if (
      JSON.stringify(data.current) !== JSON.stringify([...Users.keys()]) ||
      [...Users.keys()].length === 0
    ) {
      Users.set(data.userId, socket.id);
      socket.emit("get-users", [...Users.keys()]);
    }
  });
  socket.on("send-message-one", (data) => {
    data.to.forEach((item: any) => {
      let receiverSocketId = Users.get(item);
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit("receive-message", data);
      }
    });
    socket.to(socket.id).emit("show-my-message", data);
  });
  socket.on("seen-message", (data) => {
    const senddata = {
      seenBy: data.seenBy,
      convId: data.convId,
    };
    data.to.forEach((item: any) => {
      let receiverSocketId = Users.get(item);
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit("change-message-seen", data);
      }
    });
  });
  socket.on("logout", () => {
    console.log("user disconnected", socket.id);
    const user = [...Users.entries()].find((item) => item[1] === socket.id);
    if (user) {
      console.log("user disconnected", user);
      Users.delete(user[0]);
      socket.emit("get-users", [...Users.keys()]);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
