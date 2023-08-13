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
  }
});

const Lab = mongoose.model("Lab", labSchema);

module.exports = Lab;
