const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      "analgesic",
      "anti-inflammatory", 
      "antibiotic",
      "vitamin",
      "cardiovascular",
      "digestive",
      "respiratory",
      "dermatological",
      "neurological",
      "other"
    ]
  },
  manufacturer: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  form: {
    type: String,
    required: true,
    enum: ["comprimé", "gélule", "sachet", "sirop", "injection", "pommade", "collyre", "suppositoire", "patch", "autre"]
  },
  sideEffects: {
    type: String,
    default: "Aucun effet secondaire connu"
  },
  medicineImage: {
    type: String // File path for the medicine image
  },
  prescriptionRequired: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
