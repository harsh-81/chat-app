import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io, onlineUsers } from "../server.js";

// ─── CREATE GROUP ─────────────────────────────────────────────
const createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;
    const adminId = req.user._id;

    // 1. Validate
    if (!groupName) {
      return res.status(400).json({ message: "Group name is required" });
    }

    if (!members || members.length < 2) {
      return res.status(400).json({ message: "At least 2 members required" });
    }

    // 2. Build participants list (admin + members)
    const participants = [...new Set([String(adminId), ...members])];
    // ...new Set() removes duplicates in case admin added themselves

    // 3. Build initial unread counts (0 for everyone)
    const unreadCounts = {};
    participants.forEach((id) => {
      unreadCounts[id] = 0;
    });

    // 4. Handle group avatar if uploaded
    const groupAvatar = req.file ? req.file.path : "";

    // 5. Create the group conversation
    const group = await Conversation.create({
      type: "group",
      groupName,
      groupAvatar,
      admin: adminId,
      participants,
      unreadCounts,
    });

    // 6. Populate participants for response
    const populatedGroup = await Conversation.findById(group._id)
      .populate("participants", "-password")
      .populate("admin", "-password");

    // 7. Notify all online members about the new group
    participants.forEach((memberId) => {
      const socketId = onlineUsers[String(memberId)];
      if (socketId && String(memberId) !== String(adminId)) {
        io.to(socketId).emit("addedToGroup", populatedGroup);
      }
    });

    res.status(201).json(populatedGroup);

  } catch (error) {
    console.error("createGroup error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── GET GROUP DETAILS ────────────────────────────────────────
const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Conversation.findById(groupId)
      .populate("participants", "-password")
      .populate("admin", "-password")
      .populate("lastMessage");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a participant
    const isMember = group.participants.some(
      (p) => String(p._id) === String(req.user._id)
    );

    if (!isMember) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    res.status(200).json(group);

  } catch (error) {
    console.error("getGroupDetails error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── ADD MEMBER ───────────────────────────────────────────────
const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Conversation.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only admin can add members
    if (String(group.admin) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    // Check if already a member
    if (group.participants.includes(userId)) {
      return res.status(400).json({ message: "User already in group" });
    }

    // Add member
    group.participants.push(userId);
    group.unreadCounts.set(String(userId), 0);
    await group.save();

    const updatedGroup = await Conversation.findById(groupId)
      .populate("participants", "-password")
      .populate("admin", "-password");

    // Notify new member if online
    const newMemberSocketId = onlineUsers[String(userId)];
    if (newMemberSocketId) {
      io.to(newMemberSocketId).emit("addedToGroup", updatedGroup);
    }

    // Notify existing members
    group.participants.forEach((memberId) => {
      const socketId = onlineUsers[String(memberId)];
      if (socketId) {
        io.to(socketId).emit("groupUpdated", updatedGroup);
      }
    });

    res.status(200).json(updatedGroup);

  } catch (error) {
    console.error("addMember error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── REMOVE MEMBER ────────────────────────────────────────────
const removeMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Conversation.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only admin can remove members
    if (String(group.admin) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    // Admin cannot remove themselves
    if (String(userId) === String(group.admin)) {
      return res.status(400).json({ message: "Admin cannot be removed" });
    }

    // Remove member
    group.participants = group.participants.filter(
      (p) => String(p) !== String(userId)
    );
    group.unreadCounts.delete(String(userId));
    await group.save();

    const updatedGroup = await Conversation.findById(groupId)
      .populate("participants", "-password")
      .populate("admin", "-password");

    // Notify removed member if online
    const removedSocketId = onlineUsers[String(userId)];
    if (removedSocketId) {
      io.to(removedSocketId).emit("removedFromGroup", { groupId });
    }

    // Notify remaining members
    group.participants.forEach((memberId) => {
      const socketId = onlineUsers[String(memberId)];
      if (socketId) {
        io.to(socketId).emit("groupUpdated", updatedGroup);
      }
    });

    res.status(200).json(updatedGroup);

  } catch (error) {
    console.error("removeMember error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── LEAVE GROUP ──────────────────────────────────────────────
const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Conversation.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Admin cannot leave — must delete group or transfer admin first
    if (String(group.admin) === String(userId)) {
      return res
        .status(400)
        .json({ message: "Admin cannot leave. Delete the group instead." });
    }

    // Remove user from participants
    group.participants = group.participants.filter(
      (p) => String(p) !== String(userId)
    );
    group.unreadCounts.delete(String(userId));
    await group.save();

    // Notify remaining members
    group.participants.forEach((memberId) => {
      const socketId = onlineUsers[String(memberId)];
      if (socketId) {
        io.to(socketId).emit("groupUpdated", {
          groupId,
          leftUserId: userId,
        });
      }
    });

    res.status(200).json({ message: "Left group successfully" });

  } catch (error) {
    console.error("leaveGroup error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── DELETE GROUP ─────────────────────────────────────────────
const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Conversation.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only admin can delete group
    if (String(group.admin) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only admin can delete group" });
    }

    // Notify all members before deleting
    group.participants.forEach((memberId) => {
      const socketId = onlineUsers[String(memberId)];
      if (socketId) {
        io.to(socketId).emit("groupDeleted", { groupId });
      }
    });

    // Delete all messages in group
    await Message.deleteMany({ conversationId: groupId });

    // Delete group
    await Conversation.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Group deleted successfully" });

  } catch (error) {
    console.error("deleteGroup error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── UPDATE GROUP ─────────────────────────────────────────────
const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { groupName } = req.body;

    const group = await Conversation.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only admin can update group
    if (String(group.admin) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only admin can update group" });
    }

    const updateData = {};
    if (groupName) updateData.groupName = groupName;
    if (req.file) updateData.groupAvatar = req.file.path;

    const updatedGroup = await Conversation.findByIdAndUpdate(
      groupId,
      updateData,
      { new: true }
    )
      .populate("participants", "-password")
      .populate("admin", "-password");

    // Notify all members
    group.participants.forEach((memberId) => {
      const socketId = onlineUsers[String(memberId)];
      if (socketId) {
        io.to(socketId).emit("groupUpdated", updatedGroup);
      }
    });

    res.status(200).json(updatedGroup);

  } catch (error) {
    console.error("updateGroup error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createGroup,
  getGroupDetails,
  addMember,
  removeMember,
  leaveGroup,
  deleteGroup,
  updateGroup,
};