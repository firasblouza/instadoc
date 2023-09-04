const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
  let id = req.params.id;
  if (!id) {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded) {
      id = decoded.UserInfo.id;
    }
  }
  console;
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
  let id = req.params.id;
  const contentType = req.headers["content-type"];
  let userData = {};

  if (contentType.includes("multipart/form-data")) {
    if (req.body && req.body.user) {
      userData = JSON.parse(req.body.user);
    }
  }

  if (contentType.includes("json")) {
    userData = req.body;
  }

  if (req.files && req.files["profileImage"]) {
    userData.profileImage = req.files["profileImage"][0].filename;
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: userData },
      { new: true }
    );
    if (user) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while updating user" });
  }
};

const modifyUserPasswordById = async (req, res) => {
  let id = req.params.id;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ _id: id }).exec();
    if (user) {
      const validatePassword = await bcrypt.compare(oldPassword, user.password);

      if (!validatePassword) {
        console.log("password don't match");
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      } else {
        if (oldPassword === newPassword) {
          return res.status(409).json({
            message: "New password cannot be the same as old password"
          });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        const update = await User.findByIdAndUpdate(id, {
          password: hash
        });

        if (update) {
          res.status(200).json({ message: "Password updated successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Error while updating the password" });
  }
};
const deleteUserById = async (req, res) => {
  let id = req.params.id;
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

module.exports = {
  getAllUsers,
  getUserById,
  modifyUserById,
  deleteUserById,
  modifyUserPasswordById
};
