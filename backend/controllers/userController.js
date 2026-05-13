import User from "../models/User.js";

const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("getMe error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("getAllUsers error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, bio } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, bio },
      { new: true }
    ).select("-password");

    res.status(200).json(updated);
  } catch (error) {
    console.error("updateProfile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export { getMe, getAllUsers, updateProfile };