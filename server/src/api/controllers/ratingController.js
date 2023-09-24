const Rating = require("../models/Rating");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({}).exec();
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Error while fetching ratings" });
  }
};

const getRatingById = async (req, res) => {
  const id = req.params.id;
  try {
    const rating = await Rating.findById(id).exec();
    if (rating) {
      res.status(200).json(rating);
    } else {
      res.status(404).json({ message: "Rating not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while fetching rating" });
  }
};

const deleteRatingById = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedRating = await Rating.findByIdAndDelete(id).exec();
    if (deletedRating) {
      res.status(200).json(deletedRating);
    } else {
      res.status(404).json({ message: "Rating not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while deleting rating" });
  }
};

const getDoctorRatings = async (req, res) => {
  const doctorId = req.params.id;
  try {
    const ratings = await Rating.find({ doctorId }).exec();
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Error while fetching ratings" });
  }
};

const getUserRatings = async (req, res) => {
  const userId = req.params.id;
  try {
    const ratings = await Rating.find({ userId }).exec();
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Error while fetching ratings" });
  }
};

const createRating = async (req, res) => {
  const rating = req.body;
  try {
    const newRating = await Rating.create(rating);
    res.status(200).json(newRating);
  } catch (err) {
    res.status(500).json({ message: "Error while creating rating" });
  }
};

module.exports = {
  getAllRatings,
  getRatingById,
  deleteRatingById,
  createRating,
  getDoctorRatings,
  getUserRatings
};
