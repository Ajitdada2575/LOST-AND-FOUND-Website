const pool = require("../config/db");

const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        category_id,
        category_name,
        description
       FROM categories
       WHERE is_active = 1
       ORDER BY category_name`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch categories"
    });
  }
};

const getLocations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        location_id,
        location_name,
        description
       FROM locations
       ORDER BY location_name`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch locations"
    });
  }
};

module.exports = {
  getCategories,
  getLocations
};
