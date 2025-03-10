// models/Donation.js
const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  fundraiser: { type: mongoose.Schema.Types.ObjectId, ref: "Fundraiser", required: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", DonationSchema);
