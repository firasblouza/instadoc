const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyRole = require("../middleware/verifyRole");
const upload = require("../middleware/multer");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/:id", userController.getUserById);
router.put(
  "/:id",
  upload.fields([{ name: "profileImage" }]),
  userController.modifyUserById
);

router.put("/password/:id", verifyJWT, userController.modifyUserPasswordById);
// Admin related routes
router.get("/", verifyRole("admin"), userController.getAllUsers);

router.delete(
  "/delete/:id",
  verifyRole("admin"),
  userController.deleteUserById
);

module.exports = router;
