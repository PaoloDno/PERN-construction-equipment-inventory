const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../utils/db.js");

const generatedToken = (id, company_id, role) => {
  return jwt.sign({ id, company_id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// register user

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("AAA");
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

    console.log("Existing user:", existingUser.rows);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    console.log("Registering user:", { username, email });

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

    console.log("User registered:", user);

    res.status(201).json({
      message: "User registered successfully.",
      token: generatedToken(user.id, user.company_id, user.role),
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

    const { username, password } = req.body;

    // Find User
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid username or password."
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
        message: "Invalid username or password."
      });
    }

    
    console.log("User logged in:", user);
    res.status(200).json({
      token: generatedToken(user.id, user.company_id, user.role),
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

const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const requestedLimit =
      parseInt(req.query.limit) || 10;

    const limit = Math.min(
      Math.max(requestedLimit, 1),
      10
    );

    const offset = (page - 1) * limit;

    const allowedSortColumns = {
      id: "id",
      username: "username",
      email: "email",
      company_id: "company_id",
    };

    const sort =
      allowedSortColumns[req.query.sort] || "id";

    const order =
      req.query.order?.toLowerCase() === "asc"
        ? "ASC"
        : "DESC";

    const result = await pool.query(
      `
      SELECT id, company_id, username, email, role
      FROM users
      ORDER BY ${sort} ${order}
      LIMIT $1
      OFFSET $2
      `,
      [limit, offset]
    );

    res.status(200).json({
      users: result.rows,
      pagination: {
        page,
        limit,
        returned: result.rows.length,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve users",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  getUsers,
};