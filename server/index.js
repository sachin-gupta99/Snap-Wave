const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

const start = async () => {
  try {
    app.listen(process.env.PORT, () => {
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
