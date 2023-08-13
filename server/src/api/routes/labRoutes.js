const express = require("express");
const router = express.Router();
const labController = require("../controllers/labController");
const verifyRole = require("../middleware/verifyRole");

router.get("/", labController.getAllLabs);
router.get("/:id", labController.getLabById);

// Admin related routes
router.post("/create", verifyRole("admin"), labController.addLab);
router.put("/modify/:id", verifyRole("admin"), labController.modifyLabById);
router.delete("/delete/:id", verifyRole("admin"), labController.deleteLabById);

module.exports = router;
