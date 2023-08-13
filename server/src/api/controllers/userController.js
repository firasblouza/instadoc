const User = require("../models/User");

const getAllUsers = async (req, res) => {
  // Parameters for the pagination
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  try {
    const users = await User.find({})
      .select("-password")
      .skip(skip)
      .limit(limit)
      .exec();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error while fetching users" });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password").exec();
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while fetching user" });
  }
};

const modifyUserById = async (req, res) => {
  const id = req.params.id;
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    allergies,
    age,
    sex,
    medicalHistory
  } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, {
      email,
      firstName,
      lastName,
      phoneNumber,
      age,
      sex,
      allergies,
      medicalHistory
    });
    if (user) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while updating user" });
  }
};

const deleteUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id).exec();
    if (user) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while deleting user" });
  }
};

module.exports = { getAllUsers, getUserById, modifyUserById, deleteUserById };
