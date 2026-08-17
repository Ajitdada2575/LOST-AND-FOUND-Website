const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  markNotificationAsRead
} = require("../controllers/notificationController");

const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, getMyNotifications);
router.put("/:id/read", authenticate, markNotificationAsRead);

module.exports = router;