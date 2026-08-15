const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const [existingUsers] = await pool.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash)
       VALUES (?, ?, ?, ?)`,
      [name, email, phone || null, passwordHash]
    );

    res.status(201).json({
      message: "Registration successful",
      userId: result.insertId
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed"
    });
  }
};

module.exports = {
  register
};