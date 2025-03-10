
// const express = require("express");
// const { protect } = require("../middleware/authMiddleware");
// const { createDonation, getUserDonations ,createRazorpayOrder, verifyPayment} = require("../controllers/donationController");

// const router = express.Router();

// // 1) User donates => POST /api/donations
// router.post("/", protect, createDonation);

// // 2) User sees their donations => GET /api/donations/my-donations
// router.get("/my-donations", protect, getUserDonations);
// router.post("/create-razorpay-order", protect, createRazorpayOrder);

// // 2) Verify payment
// router.post("/verify-payment", protect, verifyPayment);

// module.exports = router;
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createRazorpayOrder,
  verifyPayment,
  getMyDonations,
  getAllDonations,
} = require("../controllers/donationController");
const { adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

// 1) Create Razorpay order
router.post("/create-razorpay-order", protect, createRazorpayOrder);

// 2) Verify Razorpay payment
router.post("/verify-payment", protect, verifyPayment);

// 3) Get user's own donations
router.get("/my-donations", protect, getMyDonations);

// 4) Admin sees all donations
router.get("/all", protect, adminProtect, getAllDonations);

module.exports = router;
