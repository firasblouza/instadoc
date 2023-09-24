const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema(
  {
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
    patientName: {
      type: String,
      required: true
    },
    doctorName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    review: {
      type: String
    }
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
