const express = require("express");

const {
  createFoundItem,
  getAllFoundItems,
  getFoundItemById,
  updateFoundItem,
  returnFoundItem
} = require("../controllers/foundController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, createFoundItem);

router.get("/", authenticate, getAllFoundItems);

router.get("/:id", authenticate, getFoundItemById);

router.put("/:id", authenticate, updateFoundItem);

router.put("/:id/return", authenticate, returnFoundItem);

module.exports = router;