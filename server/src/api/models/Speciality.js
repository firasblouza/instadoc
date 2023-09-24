const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const specialitySchema = new Schema({
  speciality: {
    type: String
  }
});
