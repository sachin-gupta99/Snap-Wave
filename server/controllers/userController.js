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
    const user = await User.findById({ _id: userId })
      .select(["email", "username", "avatarImage", "contacts", "_id"])
      .populate("contacts");
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

exports.getUserByEmail = async (req, res) => {
  console.log(req.params);
  try {
    const email = req.params.email;
    const user = await User.findOne({ email }).select([
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

exports.addContact = async (req, res) => {
  try {
    const userId = req.body.userId;
    const contactId = req.body.contactId;
    const user = await User.findById({ _id: userId });
    const contact = await User.findById({ _id: contactId });
    if (!user || !contact) {
      return res.json({
        status: "failed",
        message: "User or contact not found",
      });
    }

    if (user.contacts.includes(contactId)) {
      return res.json({
        status: "failed",
        message: "Contact already added",
      });
    }

    user.contacts.push(contactId);
    contact.contacts.push(userId);
    await user.save();
    await contact.save();
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
