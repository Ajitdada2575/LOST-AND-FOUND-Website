const express = require("express");
const {
  generateMatchesForLostItem,
  getMatchesForLostItem
} = require("../controllers/matchController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/lost/:lostId/generate",
  authenticate,
  generateMatchesForLostItem
);

router.get(
  "/lost/:lostId",
  authenticate,
  getMatchesForLostItem
);

module.exports = router;