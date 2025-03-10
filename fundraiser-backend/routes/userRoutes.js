const express = require("express");
const { updateUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route for updating the user profile
router.put("/profile", protect, updateUserProfile);

module.exports = router;
