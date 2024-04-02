const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const socket = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/userModel");

const app = express();
app.disable("x-powered-by");

let corsOptions = {

  origin: ["https://snap-wave.onrender.com/", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
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
  origin: ["https://snap-wave.onrender.com/", "http://localhost:3000"],
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", async (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("user-online", userId);
    await User.findByIdAndUpdate(userId, { isOnline: true });
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("receive-msg", data.message, data.from);
    }
  });

  socket.on("disconnect", async () => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        socket.broadcast.emit("user-offline", key);
        await User.findByIdAndUpdate(key, { isOnline: false });
      }
    }
  });
});
