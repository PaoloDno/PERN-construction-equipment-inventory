const { pool } = require("../utils/db.js");

// GET /api/equipment
const getEquipments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM equipment ORDER BY id ASC");

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// GET /api/equipment/:id
const getEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM equipment WHERE id = $1", [
      id,
    ]);

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
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  try {
    const {
      equipment_name,
      category,
      condition,
      serial_number,
      status,
      note,
    } = req.body;

    if (!equipment_name || !category || !condition) {
      return res.status(400).json({
        message: "Please complete all required fields.",
      });
    }

    console.log("Creating equipment with data:", {
      equipment_name,
      category,
      condition,
      serial_number,
      status,
      note,
      image: req.file ? req.file.filename : null,
    });
    // Image uploaded by Multer
    const image = req.file
      ? `/uploads/equipments/${req.file.filename}`
      : null;

    const result = await pool.query(
      `
      INSERT INTO equipment
      (
        equipment_name,
        category,
        condition,
        image,
        serial_number,
        status,
        note
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        equipment_name,
        category,
        condition,
        image,
        serial_number,
        status,
        note,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// PUT /api/equipment/:id
const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    const { equipment_name, category, condition, status } = req.body;

    // First get the existing equipment
    const existing = await pool.query(
      `
      SELECT *
      FROM equipment
      WHERE id = $1
      `,
      [id],
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        message: "Equipment not found.",
      });
    }

    const currentEquipment = existing.rows[0];

    // Keep old image if no new image was uploaded
    const imagePath = req.file
      ? `/uploads/equipment/${req.file.filename}`
      : currentEquipment.image_path;

    const result = await pool.query(
      `
      UPDATE equipment
      SET
        equipment_name = $1,
        category = $2,
        condition = $3,
        status = $4,
        image_path = $5
      WHERE id = $6
      RETURNING *
      `,
      [equipment_name, category, condition, status, imagePath, id],
    );

    res.status(200).json({
      message: "Equipment updated successfully.",
      equipment: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// BORROW EQUIPMENT
const borrowEquipment = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const { project, condition, user_id } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Before image is required",
      });
    }

    await client.query("BEGIN");

    // Get current equipment
    const equipmentResult = await client.query(
      `
      SELECT *
      FROM equipment
      WHERE id = $1
      FOR UPDATE
      `,
      [id],
    );

    if (equipmentResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Equipment not found",
      });
    }

    const equipment = equipmentResult.rows[0];

    if (equipment.status !== "Available") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Equipment is not available",
      });
    }

    const imageBefore = `/uploads/equipment/${req.file.filename}`;

    // Create history record
    const historyResult = await client.query(
      `
      INSERT INTO equipment_history
      (
        equipment_id,
        user_id,
        project,
        action,
        condition_before,
        image_before,
        borrowed_at
      )
      VALUES ($1, $2, $3, 'BORROW', $4, $5, NOW())
      RETURNING *
      `,
      [id, user_id, project, equipment.condition, imageBefore],
    );

    // Update equipment
    const updatedEquipment = await client.query(
      `
      UPDATE equipment
      SET
        status = 'Borrowed',
        borrowed_by = $1,
        borrowed_at = NOW(),
        condition = $2
      WHERE id = $3
      RETURNING *
      `,
      [user_id, condition, id],
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Equipment borrowed successfully",
      equipment: updatedEquipment.rows[0],
      history: historyResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      message: "Failed to borrow equipment",
    });
  } finally {
    client.release();
  }
};

// return Equipment
const returnEquipment = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const { condition } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "After image is required",
      });
    }

    await client.query("BEGIN");

    // Find active transaction
    const historyResult = await client.query(
      `
      SELECT *
      FROM equipment_history
      WHERE equipment_id = $1
        AND action = 'BORROW'
        AND returned_at IS NULL
      ORDER BY id DESC
      LIMIT 1
      FOR UPDATE
      `,
      [id],
    );

    if (historyResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "No active borrowing transaction found",
      });
    }

    const history = historyResult.rows[0];

    const imageAfter = `/uploads/equipment/${req.file.filename}`;

    // Complete transaction
    const updatedHistory = await client.query(
      `
      UPDATE equipment_history
      SET
        condition_after = $1,
        image_after = $2,
        returned_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [condition, imageAfter, history.id],
    );

    // Update current equipment state
    const equipmentResult = await client.query(
      `
      UPDATE equipment
      SET
        status = 'Available',
        condition = $1,
        borrowed_by = NULL,
        borrowed_at = NULL,
        returned_at = NOW(),
        current_image = $2
      WHERE id = $3
      RETURNING *
      `,
      [condition, imageAfter, id],
    );

    await client.query("COMMIT");

    res.json({
      message: "Equipment returned successfully",
      equipment: equipmentResult.rows[0],
      history: updatedHistory.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      message: "Failed to return equipment",
    });
  } finally {
    client.release();
  }
};

// get equipmetnHISTORY
const getEquipmentHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        h.id,
        h.project,
        h.action,
        h.condition_before,
        h.condition_after,
        h.image_before,
        h.image_after,
        h.borrowed_at,
        h.returned_at,
        h.created_at,

        u.username

      FROM equipment_history h

      LEFT JOIN users u
        ON h.user_id = u.id

      WHERE h.equipment_id = $1

      ORDER BY h.created_at DESC
      `,
      [id],
    );

    res.json({
      history: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get equipment history",
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
      [id],
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
  borrowEquipment,
  returnEquipment,
  getEquipmentHistory,
  deleteEquipment,
};
