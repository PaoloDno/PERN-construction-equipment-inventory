const { pool } = require("../utils/db");

// GET /api/equipment
const getEquipments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM equipment ORDER BY id ASC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server Error",
    })
  }
};

// GET /api/equipment/:id
const getEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM equipment WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Equipment not found.",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// POST /api/equipment
const createEquipment = async (req, res) => {
  try {
    const {
      equipment_name,
      category,
      condition,
    } = req.body;

    if (!equipment_name || !category || !condition) {
      return res.status(400).json({
        message: "Please complete all required fields.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO equipment
      (equipment_name, category, condition)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [equipment_name, category, condition]
    );

    res.status(201).json({
      message: "Equipment added successfully.",
      equipment: result.rows[0],
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// PUT /api/equipment/:id
const updateEquipment = async (req, res) => {
try {
    const { id } = req.params;

    const {
      equipment_name,
      category,
      condition,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE equipment
      SET
      equipment_name = $1,
      category = $2,
      condition = $3,
      status = $4
      WHERE id = $5
      RETURNING *
      `,
      [
        equipment_name,
        category,
        condition,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Equipment not found.",
      });
    }

    res.status(200).json({
      message: "Equipment updated successfully.",
      equipment: result.rows[0],
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// DELETE /api/equipment/:id
const deleteEquipment = async (req, res) => {
 try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM equipment
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Equipment not found.",
      });
    }

    res.status(200).json({
      message: "Equipment deleted successfully.",
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getEquipments,
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};