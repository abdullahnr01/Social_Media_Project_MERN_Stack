const UserConversion = require("../Model/User_Live_Chat/user_conversion_model");
const UserMessages = require("../Model/User_Live_Chat/user_messages_model");

module.exports.user_gell_all_conversion = async (req, res) => {};

module.exports.user_get_all_message = async (req, res) => {
  try {
    const UserLoginId = req.UserId;
    const { targetUserId } = req.query;

    const messages = await UserMessages.find({
      $or: [
        { senderId: UserLoginId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: UserLoginId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (err) {
    console.error("User get all message error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.user_live_chat_post = async (req, res) => {
  try {
    const senderId = req.UserId;
    const { receiverId, text } = req.body;

    if (!text || !receiverId) {
      return res
        .status(400)
        .json({ message: "Receiver and text are required" });
    }

    let conversation = await UserConversion.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await UserConversion.create({
        participants: [senderId, receiverId],
        lastMessage: { text, sender: senderId },
        unreadCount: 1,
      });
    } else {
      conversation.lastMessage = { text };
      conversation.unreadCount += 1;
      await conversation.save();
    }

    const message = await UserMessages.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      text,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (err) {
    console.error("Live chat post error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
