const Message = require("../models/messageModel");

exports.addMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const newMessage = new Message({
      message,
      users: [from, to],
      sender: from,
    });
    await newMessage.save();
    res.json({
      status: "success",
      message: newMessage,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.data,
    });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const { from, to } = req.body;
    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message,
      };
    });

    res.json({
      status: "success",
      messages: projectedMessages,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.data,
    });
  }
};
