// controllers/adminController.js
const User = require("../models/User");
const Fundraiser = require("../models/Fundraiser");
const Donation = require("../models/Donation");

// GET /api/admin/dashboard
// Returns dashboard data: all users, all fundraisers, and top donors.

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFundraisers = await Fundraiser.countDocuments();
    const activeFundraisers = await Fundraiser.countDocuments({ status: "active" });
    const pendingFundraisers = await Fundraiser.countDocuments({ status: "pending" });
    const rejectedFundraisers = await Fundraiser.countDocuments({ status: "rejected" });

    const totalDonationsResult = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalDonations = totalDonationsResult.length > 0 ? totalDonationsResult[0].total : 0;

    const topDonors = await Donation.aggregate([
      { $group: { _id: "$donorId", totalDonated: { $sum: "$amount" } } },
      { $sort: { totalDonated: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "donorDetails",
        },
      },
      {
        $project: {
          _id: 0,
          name: { $arrayElemAt: ["$donorDetails.name", 0] },
          totalDonated: 1,
        },
      },
    ]);

    res.json({
      totalUsers,
      totalFundraisers,
      activeFundraisers,
      pendingFundraisers,
      rejectedFundraisers,
      totalDonations: totalDonations[0]?.total || 0,
      topDonors,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Error fetching dashboard stats." });
  }
};


// PUT /api/admin/fundraisers/:id/status
// Admin updates fundraiser status; if rejecting, a rejection message can be provided.
exports.updateFundraiserStatus = async (req, res) => {
  try {
    const { status, rejectionMessage } = req.body; // status: "active", "successful", or "rejected"
    const fundraiser = await Fundraiser.findById(req.params.id);
    if (!fundraiser) {
      return res.status(404).json({ message: "Fundraiser not found." });
    }
    fundraiser.status = status;
    if (status === "rejected" && rejectionMessage) {
      fundraiser.rejectionMessage = rejectionMessage; // add this field in model if needed
    }
    await fundraiser.save();
    res.json({ message: `Fundraiser marked as ${status}.` });
  } catch (error) {
    console.error("Error updating fundraiser status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error fetching users." });
  }
};

// Get all fundraisers
exports.getAllFundraisers = async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find({}).populate("createdBy", "name email");
    res.json(fundraisers);
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
    res.status(500).json({ message: "Server error fetching fundraisers." });
  }
};

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({})
      .populate("donor", "name email")
      .populate("fundraiser", "name title goalAmount");
    res.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Server error fetching donations." });
  }
};

// Return counts of each status
exports.getFundraiserStats = async (req, res) => {
  try {
    const pendingCount = await Fundraiser.countDocuments({ status: "pending" });
    const activeCount = await Fundraiser.countDocuments({ status: "active" });
    const successfulCount = await Fundraiser.countDocuments({ status: "successful" });
    const rejectedCount = await Fundraiser.countDocuments({ status: "rejected" });
    // const  = await Fundraiser.countDocuments({ status: "rejected" });

    res.json({
      pendingCount,
      activeCount,
      successfulCount,
      rejectedCount,
    });
  } catch (error) {
    console.error("Error fetching fundraiser stats:", error);
    res.status(500).json({ message: "Server error fetching stats." });
  }
};


// GET /api/admin/admins
// Returns a list of all admin users.
exports.getAdminList = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("name email");
    res.json({ admins });
  } catch (error) {
    console.error("Error fetching admin list:", error);
    res.status(500).json({ message: "Server error" });
  }
};
