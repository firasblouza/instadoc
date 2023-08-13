const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyRole = require("../middleware/verifyRole");

router.get("/:id", userController.getUserById);
router.put("/:id", userController.modifyUserById);

// Admin related routes
router.get("/", verifyRole("admin"), userController.getAllUsers);
router.delete(
  "/delete/:id",
  verifyRole("admin"),
  userController.deleteUserById
);

module.exports = router;
