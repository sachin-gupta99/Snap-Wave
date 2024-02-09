const User = require("../models/userModel");

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
