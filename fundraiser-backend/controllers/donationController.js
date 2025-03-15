
// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const Payment = require("../models/Payment");
// const Fundraiser = require("../models/Fundraiser");
// const Donation=require('../models/Donation')

// // 1) Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// /**
//  * POST /api/donations/create-razorpay-order
//  * Body: { fundraiserId, donationAmount }
//  * Creates a Razorpay order, stores Payment record in DB with status="created"
//  */
// exports.createRazorpayOrder = async (req, res) => {
//   const { fundraiserId, donationAmount } = req.body;
//   const donor = req.user; // from auth middleware

//   if (!fundraiserId || !donationAmount) {
//     return res.status(400).json({ message: "fundraiserId and donationAmount are required." });
//   }
//   if (donationAmount <= 0) {
//     return res.status(400).json({ message: "Donation amount must be positive." });
//   }

//   try {
//     // Check fundraiser
//     const fundraiser = await Fundraiser.findById(fundraiserId);
//     if (!fundraiser) {
//       return res.status(404).json({ message: "Fundraiser not found." });
//     }
//     // Prevent donating to your own fundraiser if you want that logic
//     if (fundraiser.createdBy.toString() === donor._id.toString()) {
//       return res.status(400).json({ message: "You cannot donate to your own fundraiser." });
//     }
//     // If fundraiser is "pending" or "rejected", block donation
//     if (["pending", "rejected"].includes(fundraiser.status)) {
//       return res.status(400).json({ message: `Cannot donate to a ${fundraiser.status} fundraiser.` });
//     }

//     // Check remaining amount
//     const remaining = fundraiser.goalAmount - fundraiser.raisedAmount;
//     if (donationAmount > remaining) {
//       return res.status(400).json({ message: `Donation exceeds remaining target: ₹${remaining}.` });
//     }

//     // 2) Create order in Razorpay
//     const options = {
//       amount: donationAmount * 100, // in paise
//       currency: "INR",
//       receipt: `order_rcpt_${Date.now()}`,
//       payment_capture: 1,
//     };
//     const order = await razorpay.orders.create(options);
//     console.log("Razorpay Order Created:", order);

//     // 3) Create Payment record in DB with status="created"
//     await Payment.create({
//       order_id: order.id,
//       status: "created",
//       amount: donationAmount,
//       currency: "INR",
//       fundraiser: fundraiser._id,
//       donor: donor._id,
//     });

//     res.json({ orderId: order.id, key_id: process.env.RAZORPAY_KEY_ID });
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({ message: "Server error creating payment order." });
//   }
// };

// /**
//  * POST /api/donations/verify-payment
//  * Body: { order_id, payment_id, razorpay_signature }
//  * Verifies the signature, updates Payment record to "paid", updates fundraiser raisedAmount
//  */
// exports.verifyPayment = async (req, res) => {
//   const { order_id, payment_id, razorpay_signature } = req.body;
//   const donor = req.user;

//   if (!order_id || !payment_id || !razorpay_signature) {
//     return res.status(400).json({ message: "Missing payment verification fields." });
//   }

//   try {
//     // 1) Verify signature
//     const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
//     hmac.update(order_id + "|" + payment_id);
//     const expectedSignature = hmac.digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Payment verification failed. Invalid signature." });
//     }

//     // 2) Update Payment record to "paid"
//     const paymentRecord = await Payment.findOneAndUpdate(
//       { order_id: order_id, donor: donor._id },
//       { payment_id: payment_id, status: "paid" },
//       { new: true }
//     );
//     if (!paymentRecord) {
//       return res.status(404).json({ message: "Payment record not found for this order." });
//     }

//     // 3) Update fundraiser's raisedAmount; if goal reached => status="successful"
//     const fundraiser = await Fundraiser.findById(paymentRecord.fundraiser);
//     if (fundraiser) {
//       fundraiser.raisedAmount += paymentRecord.amount;
//       if (fundraiser.raisedAmount >= fundraiser.goalAmount) {
//         fundraiser.raisedAmount = fundraiser.goalAmount; // cap at goal
//         fundraiser.status = "successful";
//       }
//       await fundraiser.save();
//     }

//     res.json({ message: "Payment verified and donation recorded." });
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ message: "Server error verifying payment." });
//   }
// };
// exports.createDonation = async (req, res) => {
//   try {
//     const { fundraiserId, amount } = req.body;

//     // Ensure fundraiser is active/successful, not pending/rejected
//     const fundraiser = await Fundraiser.findById(fundraiserId);
//     if (!fundraiser) {
//       return res.status(404).json({ message: "Fundraiser not found" });
//     }
//     if (fundraiser.status === "pending" || fundraiser.status === "rejected") {
//       return res.status(400).json({ message: "Cannot donate to a pending or rejected fundraiser" });
//     }

//     // Create donation record
//     const donation = await Donation.create({
//       donor: req.user._id,
//       fundraiser: fundraiser._id,
//       amount,
//       status: "paid", // or "completed"
//     });

//     // Optionally update the fundraiser's raisedAmount
//     fundraiser.raisedAmount += amount;
//     // If raisedAmount >= goalAmount => set to "successful" automatically
//     if (fundraiser.raisedAmount >= fundraiser.goalAmount) {
//       fundraiser.raisedAmount = fundraiser.goalAmount; // cap it
//       fundraiser.status = "successful";
//     }
//     await fundraiser.save();

//     res.status(201).json(donation);
//   } catch (error) {
//     console.error("Error creating donation:", error);
//     res.status(500).json({ message: "Server error creating donation." });
//   }
// };

// // 2) Get User's Own Donations
// exports.getUserDonations = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     // Populate the fundraiser title, so user sees which fundraiser they donated to
//     const donations = await Donation.find({ donor: userId })
//       .populate("fundraiser", "title status")
//       .sort({ createdAt: -1 });

//     res.json(donations);
//   } catch (error) {
//     console.error("Error fetching user donations:", error);
//     res.status(500).json({ message: "Server error fetching donations." });
//   }
// };

// // 3) Admin can see all donations => already used by AdminDonation
// exports.getAllDonations = async (req, res) => {
//   try {
//     const donations = await Donation.find({})
//       .populate("donor", "name email")
//       .populate("fundraiser", "title")
//       .sort({ createdAt: -1 });

//     res.json(donations);
//   } catch (error) {
//     console.error("Error fetching donations:", error);
//     res.status(500).json({ message: "Server error fetching donations." });
//   }
// };
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Donation = require('../models/Donation')
const Fundraiser = require("../models/Fundraiser");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * POST /api/donations/create-razorpay-order
 * Body: { fundraiserId, donationAmount }
 * Creates a Razorpay order, stores Payment record with status="created"
 */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { fundraiserId, donationAmount } = req.body;
    const donor = req.user;

    // Validate inputs
    if (!fundraiserId || !donationAmount) {
      return res.status(400).json({ message: "fundraiserId and donationAmount are required." });
    }
    if (donationAmount <= 0) {
      return res.status(400).json({ message: "Donation amount must be positive." });
    }

    // Check fundraiser
    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) {
      return res.status(404).json({ message: "Fundraiser not found." });
    }
    // If fundraiser is "pending" or "rejected", block donation
    if (["pending", "rejected"].includes(fundraiser.status)) {
      return res.status(400).json({ message: `Cannot donate to a ${fundraiser.status} fundraiser.` });
    }
    // Optional: if it's your own fundraiser, block or allow as you prefer
    // if (fundraiser.createdBy.toString() === donor._id.toString()) {
    //   return res.status(400).json({ message: "You cannot donate to your own fundraiser." });
    // }

    // Check remaining goal
    const remaining = fundraiser.goalAmount - fundraiser.raisedAmount;
    if (donationAmount > remaining) {
      return res.status(400).json({ message: `Donation exceeds remaining target: ₹${remaining}.` });
    }

    // Create order in Razorpay
    const options = {
      amount: donationAmount * 100, // in paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    console.log("Razorpay Order Created:", order);

    // Store Payment record with status="created"
    await Payment.create({
      order_id: order.id,
      status: "created",
      amount: donationAmount,
      currency: "INR",
      fundraiser: fundraiser._id,
      donor: donor._id,
    });

    // Return orderId & your Razorpay key_id to the frontend
    res.json({
      orderId: order.id,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Server error creating payment order." });
  }
};

/**
 * POST /api/donations/verify-payment
 * Body: { order_id, payment_id, razorpay_signature }
 * Verifies signature, updates Payment to "paid", updates fundraiser's raisedAmount
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, razorpay_signature } = req.body;
    const donor = req.user;

    if (!order_id || !payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification fields." });
    }

    // Verify Razorpay signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(order_id + "|" + payment_id);
    const expectedSignature = hmac.digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed. Invalid signature." });
    }

    // Update Payment record to "paid"
    const paymentRecord = await Payment.findOneAndUpdate(
      { order_id, donor: donor._id },
      { payment_id, status: "paid" },
      { new: true }
    );
    if (!paymentRecord) {
      return res.status(404).json({ message: "Payment record not found." });
    }

    // Update fundraiser raisedAmount
    const fundraiser = await Fundraiser.findById(paymentRecord.fundraiser);
    if (fundraiser) {
      fundraiser.raisedAmount += paymentRecord.amount;
      if (fundraiser.raisedAmount >= fundraiser.goalAmount) {
        fundraiser.raisedAmount = fundraiser.goalAmount;
        fundraiser.status = "successful";
      }
      await fundraiser.save();
    }

    res.json({ message: "Payment verified and donation recorded." });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Server error verifying payment." });
  }
};

/**
 * GET /api/donations/my-donations
 * Returns all paid or created Payment records for the logged-in user
 */
exports.getMyDonations = async (req, res) => {
  try {
    const donorId = req.user._id;
    // Populate fundraiser title to show user which fundraiser they donated to
    const myDonations = await Payment.find({ donor: donorId })
      .populate("fundraiser", "title status")
      .sort({ createdAt: -1 });

    res.json(myDonations);
  } catch (error) {
    console.error("Error fetching my donations:", error);
    res.status(500).json({ message: "Server error fetching donations." });
  }
};

/**
 * GET /api/admin/donations
 * Admin sees all Payment records
 */
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Payment.find({})
      .populate("donor", "name email")
      .populate("fundraiser", "title")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Server error fetching donations." });
  }
};


// Get total donation amount
exports.getTotalDonations = async (req, res) => {
  try {
    const total = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    res.status(200).json({ totalDonations: total[0]?.totalAmount || 0 });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total donations", error });
  }
};

// Get top donation
exports.getTopDonation = async (req, res) => {
  try {
    const topDonation = await Payment.findOne().sort({ amount: -1 }).populate("donor");

    if (!topDonation) {
      return res.status(404).json({ message: "No donations found" });
    }

    res.status(200).json({ topDonation });
  } catch (error) {
    res.status(500).json({ message: "Error fetching top donation", error });
  }
};

