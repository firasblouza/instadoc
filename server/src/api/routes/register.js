const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const upload = require("../middleware/multer");

router.post(
  "/",
  upload.fields([{ name: "idImage" }, { name: "licenseImage" }]),
  registerController.handleSignup
);

module.exports = router;
