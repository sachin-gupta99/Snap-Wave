const User = require("../models/userModel");
const axios = require("axios");
const crypto = require("crypto");

exports.getAvatar = async (req, res) => {
  try {
    const AvatarAPI = "https://api.multiavatar.com/";
    const tempAvatars = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = crypto.randomInt(1, 1000);
      const image = await axios.get(
        `${AvatarAPI}${randomIndex}?apikey=${
          process.env.MULTIAVATAR_API_KEY
        }`
      );
      tempAvatars.push(image.data);
    }
    res.json({
      status: "success",
      avatars: tempAvatars,
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
    const user = await User.findById({ _id: userId })
      .select([
        "email",
        "username",
        "avatarImage",
        "contacts",
        "isOnline",
        "_id",
      ])
      .populate("contacts", "username email avatarImage isOnline");
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

exports.getUserBasic = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById({ _id: userId }).select([
      "username",
      "avatarImage",
      "isOnline",
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

exports.getUserByEmail = async (req, res) => {
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
    const userId = req.params.userId;
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
      user: {
        avatarImage: contact.avatarImage,
        username: contact.username,
        email: contact.email,
        isOnline: contact.isOnline,
        _id: contact._id,
      },
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.data,
    });
  }
};

exports.getContacts = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById({ _id: userId }).populate(
      "contacts",
      "username email avatarImage isOnline"
    );
    if (!user) {
      return res.json({
        status: "failed",
        message: "User not found",
      });
    }
    res.json({
      status: "success",
      contacts: user.contacts,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.data,
    });
  }
};
