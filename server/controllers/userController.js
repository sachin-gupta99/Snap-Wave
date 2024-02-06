const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.json({
        status: "failed",
        message: "User not found",
      });
    }
    delete user.password;
    res.json({
      status: "success",
      user,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.data,
    });
  }
};

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
      username: values.username,
      email: values.email,
      password: hashedPassword,
    });
    await newUser.save();
    delete newUser.password;
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);

    res.json({
      status: "success",
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "failed",
      message: error.data,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const values = {
      username: req.body.username.toString(),
      password: req.body.password.toString(),
    };
    const user = await User.findOne({ username: values.username });
    if (!user) {
      return res.json({
        status: "failed",
        message: "Invalid username",
      });
    }
    const validPassword = await bcrypt.compare(values.password, user.password);
    if (!validPassword) {
      return res.json({
        status: "failed",
        message: "Invalid password",
      });
    }
    delete user.password;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({
      status: "success",
      token,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.data,
    });
  }
};

exports.setAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const avatar = req.body.avatar;
    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.json({
        status: "failed",
        message: "User not found",
      });
    }
    user.avatarImage = avatar;
    user.isAvatarImageSet = true;
    await user.save();
    res.json({
      status: "success",
      user,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.data,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const userId = req.params.id;
    const users = await User.find({ _id: { $ne: userId } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    res.json({
      status: "success",
      users,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.data,
    });
  }
};

exports.getUser = async (req, res) => {
  try {    
    const userId = req.params.id;
    const user = await User.findById({ _id: userId }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    if (!user) {
      return res.json({
        status: "failed",
        message: "User not found",
      });
    }
    res.json({
      status: "success",
      user,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.data,
    });
  }
};
