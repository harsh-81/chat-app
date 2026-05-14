import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { upload } from "../config/cloudinary.js";

// ─── SEND MESSAGE ────────────────────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // 1. Find existing conversation or create new one
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        unreadCounts: { [receiverId]: 0, [senderId]: 0 },
      });
    }

    // 2. Handle image upload if present
    const image = req.file ? req.file.path : "";

    // 3. Create the message
    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      text: text || "",
      image,
      seenBy: [senderId], // sender has already seen their own message
    });

    // 4. Update conversation's last message
    conversation.lastMessage = message._id;

    // 5. Increment unread count for receiver
    const receiverUnread = (conversation.unreadCounts.get(String(receiverId)) || 0) + 1;
    conversation.unreadCounts.set(String(receiverId), receiverUnread);

    await conversation.save();

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

    // 1. Find the conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.status(200).json([]); // no conversation yet, return empty array
    }

    // 2. Mark messages as seen
    await Message.updateMany(
      {
        conversationId: conversation._id,
        seenBy: { $nin: [senderId] }, // not already seen by this user
      },
      {
        $addToSet: { seenBy: senderId }, // add user to seenBy array
      }
    );

    // 3. Reset unread count for this user
    conversation.unreadCounts.set(String(senderId), 0);
    await conversation.save();

    // 4. Get all messages
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 }); // oldest first

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

    // Find all conversations this user is part of
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate("participants", "-password") // get full user details
      .populate("lastMessage")               // get last message details
      .sort({ updatedAt: -1 });              // most recent first

    res.status(200).json(conversations);

  } catch (error) {
    console.error("getConversations error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export { sendMessage, getMessages, getConversations };