// const mongoose = require("mongoose");

// const PaymentSchema = new mongoose.Schema({
//   order_id: { type: String, required: true },
//   payment_id: { type: String },
//   status: { type: String, required: true },
//   amount: { type: Number, required: true },
//   currency: { type: String, required: true },
//   fundraiser: { type: mongoose.Schema.Types.ObjectId, ref: "Fundraiser" },
//   donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   created_at: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Payment", PaymentSchema);
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  payment_id: { type: String },
  status: { type: String, default: "created" }, // "created", "paid", "failed"
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  fundraiser: { type: mongoose.Schema.Types.ObjectId, ref: "Fundraiser" },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
