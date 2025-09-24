const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorPricingSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
    unique: true
  },

  // Consultation pricing
  consultationRates: {
    standardConsultation: {
      price: {
        type: Number,
        required: true,
        default: 50 // Default 50 TND
      },
      duration: {
        type: Number,
        default: 30 // 30 minutes
      }
    },
    extendedConsultation: {
      price: {
        type: Number,
        default: 80
      },
      duration: {
        type: Number,
        default: 60 // 60 minutes
      }
    },
    followUpConsultation: {
      price: {
        type: Number,
        default: 30
      },
      duration: {
        type: Number,
        default: 20 // 20 minutes
      }
    }
  },

  // Platform settings
  platformFeePercentage: {
    type: Number,
    default: 10, // 10% platform fee
    min: 0,
    max: 30
  },

  // Payout settings
  payoutSettings: {
    bankAccount: {
      accountNumber: String,
      bankName: String,
      accountHolderName: String,
      iban: String,
      swift: String
    },
    minimumPayout: {
      type: Number,
      default: 100 // Minimum 100 TND for payout
    },
    payoutFrequency: {
      type: String,
      enum: ["weekly", "biweekly", "monthly"],
      default: "monthly"
    }
  },

  // Revenue tracking
  revenue: {
    totalEarnings: {
      type: Number,
      default: 0
    },
    availableBalance: {
      type: Number,
      default: 0
    },
    pendingBalance: {
      type: Number,
      default: 0
    },
    totalPayouts: {
      type: Number,
      default: 0
    }
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  approvedByAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const DoctorPricing = mongoose.model("DoctorPricing", doctorPricingSchema);

module.exports = DoctorPricing;

