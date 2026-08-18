const express = require("express");
const {
  getCategories,
  getLocations
} = require("../controllers/lookupController");

const router = express.Router();

router.get("/categories", getCategories);
router.get("/locations", getLocations);

module.exports = router;
