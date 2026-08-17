const pool = require("../config/db");
const { createNotification } = require("./notificationController");

const createFoundItem = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      category_id,
      title,
      description,
      location_id,
      found_date,
      approximate_time,
      image_url
    } = req.body;

    if (!category_id || !title || !location_id || !found_date) {
      return res.status(400).json({
        message: "Category, title, location and found date are required"
      });
    }

    const [result] = await pool.query(
      `INSERT INTO found_items (
        user_id,
        category_id,
        location_id,
        title,
        description,
        found_date,
        approximate_time,
        image_url,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [
        userId,
        category_id,
        location_id,
        title,
        description || null,
        found_date,
        approximate_time || null,
        image_url || null
      ]
    );

    res.status(201).json({
      message: "Found item reported successfully",
      foundItemId: result.insertId
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to report found item"
    });
  }
};


const getAllFoundItems = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        f.found_item_id,
        f.title,
        f.description,
        f.found_date,
        f.approximate_time,
        f.image_url,
        f.status,
        f.created_at,
        f.user_id,
        u.name AS reported_by,
        f.category_id,
        c.category_name,
        f.location_id,
        l.location_name
      FROM found_items f
      JOIN users u ON f.user_id = u.user_id
      JOIN categories c ON f.category_id = c.category_id
      JOIN locations l ON f.location_id = l.location_id
      ORDER BY f.created_at DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch found items"
    });
  }
};


const getFoundItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT
        f.found_item_id,
        f.title,
        f.description,
        f.found_date,
        f.approximate_time,
        f.image_url,
        f.status,
        f.created_at,
        f.updated_at,
        f.user_id,
        u.name AS reported_by,
        f.category_id,
        c.category_name,
        f.location_id,
        l.location_name
      FROM found_items f
      JOIN users u ON f.user_id = u.user_id
      JOIN categories c ON f.category_id = c.category_id
      JOIN locations l ON f.location_id = l.location_id
      WHERE f.found_item_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Found item not found"
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch found item"
    });
  }
};


const updateFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const {
      category_id,
      title,
      description,
      location_id,
      found_date,
      approximate_time,
      image_url
    } = req.body;

    const [items] = await pool.query(
      `SELECT user_id
       FROM found_items
       WHERE found_item_id = ?`,
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        message: "Found item not found"
      });
    }

    if (items[0].user_id !== userId) {
      return res.status(403).json({
        message: "You can only update your own found item"
      });
    }

    await pool.query(
      `UPDATE found_items
       SET category_id = ?,
           title = ?,
           description = ?,
           location_id = ?,
           found_date = ?,
           approximate_time = ?,
           image_url = ?
       WHERE found_item_id = ?`,
      [
        category_id,
        title,
        description || null,
        location_id,
        found_date,
        approximate_time || null,
        image_url || null,
        id
      ]
    );

    res.json({
      message: "Found item updated successfully",
      foundItemId: id
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update found item"
    });
  }
};


const returnFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const [items] = await pool.query(
      `SELECT user_id, title, status
       FROM found_items
       WHERE found_item_id = ?`,
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        message: "Found item not found"
      });
    }

    if (items[0].user_id !== userId) {
      return res.status(403).json({
        message: "You can only return your own found item"
      });
    }

    if (items[0].status === "RETURNED") {
      return res.status(400).json({
        message: "Found item is already returned"
      });
    }

    await pool.query(
      `UPDATE found_items
       SET status = 'RETURNED'
       WHERE found_item_id = ?`,
      [id]
    );

    // Create notification for the user who reported the found item
    await createNotification(
      userId,
      "ITEM_RETURNED",
      "Item Returned",
      `Your found item "${items[0].title}" has been marked as returned.`
    );

    res.json({
      message: "Found item marked as returned successfully",
      foundItemId: id
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to return found item"
    });
  }
};


module.exports = {
  createFoundItem,
  getAllFoundItems,
  getFoundItemById,
  updateFoundItem,
  returnFoundItem
};