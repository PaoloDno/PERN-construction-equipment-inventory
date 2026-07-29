const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../utils/db");

const generatedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// register user

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields.",
      });
    }

    // check if email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert User
    const newUser = await pool.query(
      `
      INSERT INTO users
      (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, company_id, username, email, role
      `,
      [username, email, hashedPassword],
    );

    const user = newUser.rows[0];

    res.status(201).json({
      message: "User registered successfully.",
      token: generateToken(user.id),
      user,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// login user

const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Find User
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid email or password."
      });
    }

    const user = result.rows[0];

    // Compare Password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password."
      });
    }

    res.status(200).json({
      token: generateToken(user.id),
      user: {
        id: user.id,
        company_id: user.company_id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

// get logged in user

const getProfile = async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT
      id,
      company_id,
      username,
      email,
      role
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message: "Server Error"
    });

  }

};

module.exports = {
  registerUser,
  loginUser,
  getProfile
};