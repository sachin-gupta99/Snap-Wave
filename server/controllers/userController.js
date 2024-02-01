const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username: username });

    if (usernameCheck) {
      return res.json({
        status: "failed",
        message: "Username already exists",
      });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({
        status: "failed",
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    delete newUser.password;
    res.json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.data,
    });
  }
};
