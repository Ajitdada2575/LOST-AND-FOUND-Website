const pool = require("../config/db");

const createLostItem = async (req, res) => {
  try {
    const {
      category_id,
      title,
      description,
      location_id,
      lost_date,
      approximate_time,
      image_url
    } = req.body;

    if (
      !category_id ||
      !title ||
      !location_id ||
      !lost_date
    ) {
      return res.status(400).json({
        message: "Category, title, location and lost date are required"
      });
    }

    const [result] = await pool.query(
      `INSERT INTO lost_items (
        user_id,
        category_id,
        title,
        description,
        location_id,
        lost_date,
        approximate_time,
        image_url,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [
        req.user.userId,
        category_id,
        title,
        description || null,
        location_id,
        lost_date,
        approximate_time || null,
        image_url || null
      ]
    );

    res.status(201).json({
      message: "Lost item reported successfully",
      lostItemId: result.insertId
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to report lost item"
    });
  }
};




const getLostItems = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        li.lost_item_id,
        li.title,
        li.description,
        li.lost_date,
        li.approximate_time,
        li.image_url,
        li.status,
        li.created_at,
        u.user_id,
        u.name AS reported_by,
        c.category_id,
        c.category_name,
        l.location_id,
        l.location_name
      FROM lost_items li
      JOIN users u ON li.user_id = u.user_id
      JOIN categories c ON li.category_id = c.category_id
      JOIN locations l ON li.location_id = l.location_id
      WHERE li.status = 'ACTIVE'
      ORDER BY li.created_at DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch lost items"
    });
  }
};

const getLostItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT
        li.lost_item_id,
        li.title,
        li.description,
        li.lost_date,
        li.approximate_time,
        li.image_url,
        li.status,
        li.created_at,
        u.user_id,
        u.name AS reported_by,
        c.category_id,
        c.category_name,
        l.location_id,
        l.location_name
      FROM lost_items li
      JOIN users u ON li.user_id = u.user_id
      JOIN categories c ON li.category_id = c.category_id
      JOIN locations l ON li.location_id = l.location_id
      WHERE li.lost_item_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Lost item not found"
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch lost item"
    });
  }
};

const updateLostItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      title,
      description,
      location_id,
      lost_date,
      approximate_time,
      image_url,
      status
    } = req.body;

    const [items] = await pool.query(
      "SELECT user_id FROM lost_items WHERE lost_item_id = ?",
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        message: "Lost item not found"
      });
    }

    if (items[0].user_id !== req.user.userId) {
      return res.status(403).json({
        message: "You can only update your own lost item"
      });
    }

    if (!category_id || !title || !location_id || !lost_date) {
      return res.status(400).json({
        message: "Category, title, location and lost date are required"
      });
    }

    const [result] = await pool.query(
      `UPDATE lost_items
       SET
         category_id = ?,
         title = ?,
         description = ?,
         location_id = ?,
         lost_date = ?,
         approximate_time = ?,
         image_url = ?,
         status = ?
       WHERE lost_item_id = ?`,
      [
        category_id,
        title,
        description || null,
        location_id,
        lost_date,
        approximate_time || null,
        image_url || null,
        status || "ACTIVE",
        id
      ]
    );

    res.json({
      message: "Lost item updated successfully",
      lostItemId: id
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update lost item"
    });
  }
};

const resolveLostItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [items] = await pool.query(
      "SELECT user_id, status FROM lost_items WHERE lost_item_id = ?",
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        message: "Lost item not found"
      });
    }

    if (items[0].user_id !== req.user.userId) {
      return res.status(403).json({
        message: "You can only resolve your own lost item"
      });
    }

    if (items[0].status === "RESOLVED") {
      return res.status(400).json({
        message: "Lost item is already resolved"
      });
    }

    await pool.query(
      `UPDATE lost_items
       SET status = 'RESOLVED'
       WHERE lost_item_id = ?`,
      [id]
    );

    res.json({
      message: "Lost item resolved successfully",
      lostItemId: id
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to resolve lost item"
    });
  }
};


module.exports = {
  createLostItem,
  getLostItems,
  getLostItemById,
  updateLostItem,
  resolveLostItem
};