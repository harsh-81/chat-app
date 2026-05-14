import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io, onlineUsers } from "../server.js";

// ─── SEND MESSAGE ────────────────────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // 1. Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        unreadCounts: { [receiverId]: 0, [senderId]: 0 },
      });
    }

    // 2. Handle image upload
    const image = req.file ? req.file.path : "";

    // 3. Create message
    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      text: text || "",
      image,
      seenBy: [senderId],
    });

    // 4. Update conversation
    conversation.lastMessage = message._id;
    const receiverUnread =
      (conversation.unreadCounts.get(String(receiverId)) || 0) + 1;
    conversation.unreadCounts.set(String(receiverId), receiverUnread);
    await conversation.save();

    // 5. Emit message to receiver in real-time if they are online
    const receiverSocketId = onlineUsers[String(receiverId)];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);

      // Also update their conversation list in real-time
      io.to(receiverSocketId).emit("conversationUpdated", {
        conversationId: conversation._id,
        lastMessage: message,
        unreadCount: receiverUnread,
      });
    }

    res.status(201).json(message);

  } catch (error) {
    console.error("sendMessage error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── GET MESSAGES ────────────────────────────────────────────
const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    // Mark messages as seen
    await Message.updateMany(
      {
        conversationId: conversation._id,
        seenBy: { $nin: [senderId] },
      },
      {
        $addToSet: { seenBy: senderId },
      }
    );

    // Reset unread count
    conversation.unreadCounts.set(String(senderId), 0);
    await conversation.save();

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {
    console.error("getMessages error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── GET CONVERSATIONS ───────────────────────────────────────
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate("participants", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);

  } catch (error) {
    console.error("getConversations error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export { sendMessage, getMessages, getConversations };