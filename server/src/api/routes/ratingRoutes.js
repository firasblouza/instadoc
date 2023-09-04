const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const verifyRole = require("../middleware/verifyRole");

router.get("/", ratingController.getAllRatings);
router.get("/:id", ratingController.getRatingById);
router.delete("/:id", verifyRole("admin"), ratingController.deleteRatingById);
router.post("/", ratingController.createRating);
router.get("/doctor/:id", ratingController.getDoctorRatings);
router.get("/user/:id", ratingController.getUserRatings);
module.exports = router;
