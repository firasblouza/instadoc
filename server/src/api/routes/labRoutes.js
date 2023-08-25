const express = require("express");
const router = express.Router();
const labController = require("../controllers/labController");
const verifyRole = require("../middleware/verifyRole");
const upload = require("../middleware/multer");

router.get("/", labController.getAllLabs);
router.get("/:id", labController.getLabById);

// Admin related routes
router.post(
  "/add",
  upload.fields([{ name: "labImage" }]),
  verifyRole("admin"),
  labController.addLab
);
router.put(
  "/edit/:id",
  upload.fields([{ name: "labImage" }]),
  verifyRole("admin"),
  labController.modifyLabById
);
router.delete("/delete/:id", verifyRole("admin"), labController.deleteLabById);

module.exports = router;
