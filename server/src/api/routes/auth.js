// Authentication route
const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

router.post("/", authController.handleAuth);

module.exports = router;
