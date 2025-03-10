// routes/adminRoutes.js
const express = require("express");
const { getAdminDashboardStats, updateFundraiserStatus, getAdminList,  getAllUsers, getAllFundraisers, getAllDonations ,  getFundraiserStats} = require("../controllers/adminController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", protect, adminProtect, getAdminDashboardStats);
router.put("/fundraisers/:id/status", protect, adminProtect, updateFundraiserStatus);
router.get("/admins", protect, adminProtect, getAdminList);

router.get("/users", protect, adminProtect, getAllUsers);
router.get("/fundraisers", protect, adminProtect, getAllFundraisers);
router.get("/donations", protect, adminProtect, getAllDonations);
router.get("/stats", protect, adminProtect, getFundraiserStats);
module.exports = router;
