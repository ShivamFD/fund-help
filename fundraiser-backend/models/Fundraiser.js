const mongoose = require("mongoose");

const FundraiserSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  image: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "successful", "rejected"],
    default: "pending", // new fundraisers start as pending
  },
  rejectionMessage: { type: String }, // only used if rejected
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Fundraiser", FundraiserSchema);
