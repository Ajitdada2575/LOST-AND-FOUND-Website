const express = require("express");
const router = express.Router();

const {
  createClaim,
  getMyClaims,
  getAllClaims,
  reviewClaim
} = require("../controllers/claimController");

const authenticate = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.post("/", authenticate, createClaim);

router.get("/my", authenticate, getMyClaims);

router.get("/", authenticate, adminOnly, getAllClaims);

router.put("/:id/review", authenticate, adminOnly, reviewClaim);

module.exports = router;