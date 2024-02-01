const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const values = {
      username: req.body.username.toString(),
      email: req.body.email.toString(),
      password: req.body.password.toString(),
    };
    const usernameCheck = await User.findOne({ username: values.username });

    if (usernameCheck) {
      return res.json({
        status: "failed",
        message: "Username already exists",
      });
    }

    const emailCheck = await User.findOne({ email: values.email });
    if (emailCheck) {
      return res.json({
        status: "failed",
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(values.password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    delete newUser.password;
    res.json({
      status: "success",
      user: newUser,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.data,
    });
  }
};
