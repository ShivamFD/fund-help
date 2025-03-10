const mongoose = require("mongoose");
const Fundraiser = require("../models/Fundraiser");

// Create Fundraiser – only if no active fundraiser exists for the user
exports.createFundraiser = async (req, res) => {
  const { title, description, goalAmount } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const userId = req.user.id;

  try {
    // Allow new creation only if no active fundraiser exists
    const existingActive = await Fundraiser.findOne({ createdBy: userId, status: "active" });
    if (existingActive) {
      return res.status(400).json({ message: "You already have an active fundraiser. Complete or get it approved/rejected to create a new one." });
    }

    const fundraiser = await Fundraiser.create({
      title,
      description,
      goalAmount,
      image,
      createdBy: userId,
      status: "pending",

    });

    res.status(201).json(fundraiser);
  } catch (error) {
    console.error("Error creating fundraiser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single fundraiser by ID
exports.getFundraiserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid fundraiser ID format." });
    }
    const fundraiser = await Fundraiser.findById(req.params.id);
    if (!fundraiser) {
      return res.status(404).json({ message: "Fundraiser not found." });
    }
    res.json(fundraiser);
  } catch (error) {
    console.error("Error fetching fundraiser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get the fundraiser created by the logged-in user (if any)
exports.getMyFundraisers = async (req, res) => {
  try {
    // Make sure your auth middleware sets req.user._id
    const userId = req.user._id;

    const pendingFundraisers = await Fundraiser.find({ createdBy: userId, status: "pending" });
    const activeFundraisers = await Fundraiser.find({ createdBy: userId, status: "active" });
    const successfulFundraisers = await Fundraiser.find({ createdBy: userId, status: "successful" });
    const failedFundraisers = await Fundraiser.find({ createdBy: userId, status: "rejected" });

    res.json({
      pendingFundraisers,
      activeFundraisers,
      successfulFundraisers,
      failedFundraisers,
    });
  } catch (error) {
    console.error("Error fetching user fundraisers:", error);
    res.status(500).json({ message: "Server error fetching fundraisers." });
  }
}

// Update Fundraiser – only title, goalAmount, and image (cannot change raisedAmount or status)
exports.updateFundraiser = async (req, res) => {
  try {
    const fundraiser = await Fundraiser.findById(req.params.id);
    if (!fundraiser) {
      return res.status(404).json({ message: "Fundraiser not found." });
    }
    if (fundraiser.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to update this fundraiser." });
    }
    fundraiser.title = req.body.title || fundraiser.title;
    fundraiser.goalAmount = req.body.goalAmount || fundraiser.goalAmount;
    if (req.file) {
      fundraiser.image = `/uploads/${req.file.filename}`;
    }
    const updatedFundraiser = await fundraiser.save();
    res.json(updatedFundraiser);
  } catch (error) {
    console.error("Error updating fundraiser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Fundraiser
exports.deleteFundraiser = async (req, res) => {
  try {
    const fundraiser = await Fundraiser.findById(req.params.id);
    if (!fundraiser) {
      return res.status(404).json({ message: "Fundraiser not found." });
    }
    if (fundraiser.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to delete this fundraiser." });
    }
    await fundraiser.remove();
    res.json({ message: "Fundraiser removed" });
  } catch (error) {
    console.error("Error deleting fundraiser:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getFundraisers = async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find({});
    res.json(fundraisers);
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getUserFundraisers = async (req, res) => {
  try {
    const userId = req.user.id;

    const pendingFundraisers = await Fundraiser.find({ createdBy: userId, status: "pending" });
    const activeFundraisers = await Fundraiser.find({ createdBy: userId, status: "active" });
    const successfulFundraisers = await Fundraiser.find({ createdBy: userId, status: "successful" });
    const failedFundraisers = await Fundraiser.find({ createdBy: userId, status: "rejected" });

    res.json({
      pendingFundraisers,
      activeFundraisers,
      successfulFundraisers,
      failedFundraisers,
    });
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
    res.status(500).json({ message: "Server error fetching fundraisers." });
  }
};


// Only show Active or Successful on homepage
exports.getPublicFundraisers = async (req, res) => {
  try {
    // Filter out "rejected" and "pending"
    const fundraisers = await Fundraiser.find({
      status: { $in: ["active"] },
    }).sort({ createdAt: -1 }); // optional sort by newest
    res.json(fundraisers);
  } catch (error) {
    console.error("Error fetching public fundraisers:", error);
    res.status(500).json({ message: "Server error fetching public fundraisers." });
  }
};


// Admin can update status of a fundraiser (Approve or Reject)
exports.updateFundraiserStatus = async (req, res) => {
  try {
    const { status } = req.body; // status should be "successful" or "rejected"
    
    const fundraiser = await Fundraiser.findById(req.params.id);
    if (!fundraiser) {
      return res.status(404).json({ message: "Fundraiser not found." });
    }

    fundraiser.status = status;
    await fundraiser.save();

    res.json({ message: `Fundraiser marked as ${status}.` });
  } catch (error) {
    console.error("Error updating fundraiser status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
