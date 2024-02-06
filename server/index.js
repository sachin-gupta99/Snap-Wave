const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const socket = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoutes);

let server;

const start = async () => {
  try {
    server = app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });

    const database_connect = await mongoose.connect(process.env.MONGODB_URI);
    if (database_connect) {
      console.log("Database connected successfully");
    }
  } catch (error) {
    console.log(error);
  }
};

start();

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("receive-msg", data.message);
    }
  });
});
