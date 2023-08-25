const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    location: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  },
  contact: {
    email: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      requierd: true
    }
  },
  labImage: {
    type: String, // This is going to be a file path for the doctor's profile.
    required: true
  }
});

const Lab = mongoose.model("Lab", labSchema);

module.exports = Lab;
