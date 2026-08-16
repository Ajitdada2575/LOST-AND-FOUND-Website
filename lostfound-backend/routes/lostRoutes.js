const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const {
  createLostItem,
  getLostItems,
  getLostItemById,
  updateLostItem,
  resolveLostItem
} = require("../controllers/lostController");

const router = express.Router();

router.post("/", authenticate, createLostItem);
router.get("/", authenticate, getLostItems);
router.get("/:id", authenticate, getLostItemById);
router.put("/:id", authenticate, updateLostItem);
router.put("/:id/resolve", authenticate, resolveLostItem);

module.exports = router;