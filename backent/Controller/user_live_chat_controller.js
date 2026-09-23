const UserConversion = require("../Model/User_Live_Chat/user_conversion_model");
const UserMessages = require("../Model/User_Live_Chat/user_messages_model");

// GET /conversation/:targetUserId
module.exports.user_get_OR_create_conversion = async (req, res) => {
  const senderId = req.UserId; // Logged-in user
  const receiverId = req.params.targetUserId;

  console.log("ye chala hai");

  try {
    let conversation = await UserConversion.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await UserConversion.create({
        participants: [senderId, receiverId],
        lastMessage: null,
        unreadCount: 0,
      });
    }

    return res.status(200).json({ conversationId: conversation._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.get_user_all_conversations = async (req, res) => {
  try {
    const loggedInUserId = req.UserId;
    const conversations = await UserConversion.find({
      participants: loggedInUserId,
    })
      .populate({
        path: "participants",
        select: "firstname lastname image isOnline lastSeen",
      })
      .sort({ updatedAt: -1 }); // Latest chat sabse upar aayegi

    return res.status(200).json({
      message: "Conversations fetched successfully",
      data: conversations,
    });
  } catch (err) {
    console.error("Get user conversations error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// module.exports.user_get_all_message = async (req, res) => {

//   try {
//     const UserLoginId = req.UserId;
//     const { targetUserId } = req.query;

//     const messages = await UserMessages.find({
//       $or: [
//         { senderId: UserLoginId, receiverId: targetUserId },
//         { senderId: targetUserId, receiverId: UserLoginId },
//       ],
//     })
//       .populate("senderId", "image firstname lastname")
//       .populate("receiverId", "image firstname lastname")

//       .sort({ createdAt: 1 });

//     return res.status(200).json({
//       message: "Messages fetched successfully",
//       data: messages,
//     });
//   } catch (err) {
//     console.error("User get all message error:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

module.exports.user_get_all_message = async (req, res) => {
  try {
    const UserLoginId = req.UserId;
    const { targetUserId } = req.query;

    if (!targetUserId) {
      return res.status(400).json({ message: "targetUserId is required" });
    }

    // Direct Database Fetch - Populate completely removed
    const messages = await UserMessages.find({
      $or: [
        { senderId: UserLoginId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: UserLoginId },
      ],
    })
      .select("senderId receiverId text createdAt") 
      .sort({ createdAt: 1 })
      .lean(); 

    return res.status(200).json({
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (err) {
    console.error("User get all message error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.mark_as_read = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId || conversationId === "undefined") {
      return res
        .status(400)
        .json({ message: "Valid conversationId is required" });
    }

    await UserConversion.findByIdAndUpdate(conversationId, {
      unreadCount: 0,
    });

    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (err) {
    console.error("Mark as read error:", err);
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

    const io = req.app.get("io");
    io.to(conversation._id.toString()).emit("receiveMessage", message);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      //   data: message,
    });
  } catch (err) {
    console.error("Live chat post error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
