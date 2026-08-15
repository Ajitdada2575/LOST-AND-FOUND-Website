const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS connected");

    res.json({
      server: "OK",
      database: rows[0].connected === 1 ? "OK" : "ERROR"
    });
  } catch (error) {
    res.status(500).json({
      server: "OK",
      database: "ERROR"
    });
  }
});

module.exports = router;