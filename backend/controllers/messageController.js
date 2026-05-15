import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io, onlineUsers } from "../server.js";

// ─── SEND MESSAGE ────────────────────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // Find conversation — works for both direct and group
    let conversation = await Conversation.findById(receiverId);

    // If not found by ID it might be a direct chat — find by participants
    if (!conversation) {
      conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
        type: "direct",
      });
    }

    // Create new direct conversation if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [senderId, receiverId],
        unreadCounts: { [receiverId]: 0, [senderId]: 0 },
      });
    }

    const image = req.file ? req.file.path : "";

    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      text: text || "",
      image,
      seenBy: [senderId],
    });

    conversation.lastMessage = message._id;

    // Update unread counts for all participants except sender
    conversation.participants.forEach((participantId) => {
      if (String(participantId) !== String(senderId)) {
        const current =
          conversation.unreadCounts.get(String(participantId)) || 0;
        conversation.unreadCounts.set(String(participantId), current + 1);
      }
    });

    await conversation.save();

    // Emit to all online participants except sender
    conversation.participants.forEach((participantId) => {
      if (String(participantId) !== String(senderId)) {
        const socketId = onlineUsers[String(participantId)];
        if (socketId) {
          io.to(socketId).emit("newMessage", message);
          io.to(socketId).emit("conversationUpdated", {
            conversationId: conversation._id,
            lastMessage: message,
            unreadCount: conversation.unreadCounts.get(String(participantId)),
          });
        }
      }
    });

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