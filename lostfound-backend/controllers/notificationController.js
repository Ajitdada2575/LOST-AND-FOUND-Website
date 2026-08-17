const pool = require("../config/db");

const createNotification = async (
  userId,
  notificationType,
  title,
  message
) => {
  const [result] = await pool.query(
    `INSERT INTO notifications (
      user_id,
      notification_type,
      title,
      message,
      is_read
    )
    VALUES (?, ?, ?, ?, 0)`,
    [
      userId,
      notificationType,
      title,
      message
    ]
  );

  return result.insertId;
};


const getMyNotifications = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        notification_id,
        notification_type,
        title,
        message,
        is_read,
        created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch notifications"
    });
  }
};


const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT notification_id
       FROM notifications
       WHERE notification_id = ?
       AND user_id = ?`,
      [id, req.user.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    await pool.query(
      `UPDATE notifications
       SET is_read = 1
       WHERE notification_id = ?`,
      [id]
    );

    res.json({
      message: "Notification marked as read",
      notificationId: id
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to mark notification as read"
    });
  }
};


module.exports = {
  createNotification,
  getMyNotifications,
  markNotificationAsRead
};