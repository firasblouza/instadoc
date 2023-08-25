const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  review: {
    type: String
  }
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
