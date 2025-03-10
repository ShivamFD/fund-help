// routes/fundraiserRoutes.js
const express = require("express");
const { createFundraiser, getFundraisers, updateFundraiser, deleteFundraiser, getMyFundraisers ,getFundraiserById,updateFundraiserStatus,getUserFundraisers,  getPublicFundraisers } = require("../controllers/fundraiserController");
// const { protect } = require("../middleware/authMiddleware");
const { protect, adminProtect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("image"), createFundraiser);
  router.get("/", getFundraisers); 
router.get("/mine", protect, getMyFundraisers); // get fundraiser created by logged-in user
router.put("/:id", protect, upload.single("image"), updateFundraiser);
router.delete("/:id", protect, deleteFundraiser);
router.get("/:id", getFundraiserById); 
router.put("/:id/status", protect, adminProtect, updateFundraiserStatus);
router.get("/user-fundraisers", protect, getUserFundraisers);
router.get("/public", getPublicFundraisers);
module.exports = router;
