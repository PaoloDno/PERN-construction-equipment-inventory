const { pool } = require("../utils/db.js");

// GET /api/equipment
const getEquipments = async (req, res) => {
  try {
    console.log(`Route Parameters: ${JSON.stringify(req.params)}`);

    const page = Math.max(parseInt(req.params.page) || 1, 1);

    console.log(`Current Page: ${page}`);

    const limit = 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `
      SELECT
        e.id,
        e.equipment_name,
        e.category,
        e.condition,
        e.status,
        e.note,
        e.image,
        e.created_at,

        u.username,
        u.company_id,

        p.id AS project_id,
        p.project_name,
        p.location,
        p.status AS project_status

      FROM equipment e

      JOIN users u
        ON e.created_by = u.id

      LEFT JOIN project_equipment pe
        ON e.id = pe.equipment_id
        AND pe.returned_at IS NULL

      LEFT JOIN projects p
        ON pe.project_id = p.id

      ORDER BY e.created_at DESC

      LIMIT $1
      OFFSET $2
      `,
      [limit, offset],
    );

    const countResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM equipment
      `,
    );

    const totalUnits = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalUnits / limit);

    console.log(
      `Total Equipments: ${totalUnits}, Total Pages: ${totalPages}`,
    );

    console.log(`Equipments Retrieved: ${result.rows.length}`);

    res.status(200).json({
      equipments: result.rows,
      pagination: {
        currentPage: page,
        unitsPerPage: limit,
        totalUnits,
        totalPages,
      },
    });
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
    const result = await pool.query(
      `
      SELECT
      *
      FROM equipment
      WHERE id = $1 `,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Equipment not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get equipment error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// POST /api/equipment
const createEquipment = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { equipment_name, category, condition, note } = req.body;

    if (!equipment_name || !category || !condition) {
      return res
        .status(400)
        .json({ message: "Please complete all required fields." });
    }
    const created_by = req.user?.id;
    if (!created_by) {
      return res.status(401).json({ message: "User authentication required." });
    }

    const image = req.file ? `/uploads/equipments/${req.file.filename}` : null;

    const result = await pool.query(
      ` INSERT INTO equipment 
      ( 
        equipment_name,
        category,
        condition,
        note,
        image,
        created_by
      ) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING * `,
      [equipment_name, category, condition, note || null, image, created_by],
    );
    res.status(201).json({
      message: "Equipment created successfully.",
      equipment: result.rows[0],
    });
  } catch (error) {
    console.error("Create equipment error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// PUT /api/equipment/:id
const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    const { equipment_name, category, condition, note } = req.body;

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
        note = $4,
        image_path = $5
      WHERE id = $6
      RETURNING *
      `,
      [equipment_name, category, condition, note || null, imagePath, id],
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
  console.log("Borrow Equipment Request Body:", req.body);
  try {
    const { id } = req.params;
    const { project_id, condition, user_id, note } = req.body;
    console.log("Borrow Equipment Request Params:", req.params);
    console.log("Borrow Equipment Request File:", req.file);
    console.log("Borrow Equipment Request Body:", req.body);
    if (!req.file) {
      return res.status(400).json({
        message: "Before image is required",
      });
    }
    if (!project_id) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }
    if (!user_id) {
      return res.status(400).json({
        message: "Authentication is required",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Target Equipment is required",
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

    if (equipment.status !== "available") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Equipment is not available",
      });
    }

    const imageBefore = `/uploads/equipments/${req.file.filename}`;

    // Create project_equipment
    const assignmentResult = await client.query(
      `
  INSERT INTO project_equipment
  (
    project_id,
    equipment_id,
    user_id,
    status,
    condition_before,
    image_before,
    borrowed_at
  )
  VALUES ($1, $2, $3, 'borrowed', $4, $5, NOW())
  RETURNING *
  `,
      [project_id, id, user_id, condition, imageBefore],
    );

    // Update equipment
    const updatedEquipment = await client.query(
      `
  UPDATE equipment
  SET
    status = 'borrowed',
    condition = $1,
    note = $2,
    image = $3
  WHERE id = $4
  RETURNING *
  `,
      [condition, note, imageBefore, id],
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Equipment borrowed successfully",
      equipment: updatedEquipment.rows[0],
      history: assignmentResult.rows[0],
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

    console.log("Return Equipment Request Params:", req.params);

    if (!req.file) {
      return res.status(400).json({
        message: "After image is required",
      });
    }

    if (!condition) {
      return res.status(400).json({
        message: "Condition after return is required.",
      });
    }

    await client.query("BEGIN");

    // Find the equipment
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

    // 2. Make sure equipment is actually borrowed
    if (equipment.status !== "borrowed") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Equipment is not currently borrowed",
      });
    }



    // Find its active project_equipment row
    const assignmentResult = await client.query(
      `
      SELECT *
      FROM project_equipment
      WHERE equipment_id = $1
        AND returned_at IS NULL
      ORDER BY borrowed_at DESC
      LIMIT 1
      FOR UPDATE
      `,
      [id],
    );

    if (assignmentResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "No active project assignment found",
      });
    }

    const assignment = assignmentResult.rows[0];

    // Image after return
    const imageAfter = `/uploads/equipments/${req.file.filename}`;

    // Close the project_equipment transaction
    const projectEquipmentResult = await client.query(
      `
      UPDATE project_equipment
      SET
        condition_after = $1,
        image_after = $2,
        status = 'returned',
        returned_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [condition, imageAfter, assignment.id],
    );

    // 6. Make equipment available again
    const updatedEquipment = await client.query(
      `
      UPDATE equipment
      SET
        status = 'available',
        condition = $1,
        image = $2
      WHERE id = $3
      RETURNING *
      `,
      [condition, imageAfter, id],
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Equipment returned successfully",
      equipment: updatedEquipment.rows[0],
      history: projectEquipmentResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Return equipment error:", error);

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

    if (!id) {
      return res.status(400).json({
        message: "Equipment ID is required.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        pe.id,

        pe.project_id,
        p.project_name,

        pe.equipment_id,

        pe.user_id,
        u.username,

        pe.status,

        pe.condition_before,
        pe.condition_after,

        pe.image_before,
        pe.image_after,

        pe.borrowed_at,
        pe.returned_at

      FROM equipment e

      INNER JOIN project_equipment pe
        ON e.id = pe.equipment_id

      LEFT JOIN projects p
        ON pe.project_id = p.id

      LEFT JOIN users u
        ON pe.user_id = u.id

      WHERE e.id = $1

      ORDER BY pe.borrowed_at DESC
      `,
      [id],
    );

    res.status(200).json({
      history: result.rows,
    });
  } catch (error) {
    console.error("Get equipment history error:", error);

    res.status(500).json({
      message: "Failed to get equipment history.",
    });
  }
};

// DELETE /api/equipment/:id
const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      ` DELETE FROM equipment WHERE id = $1 RETURNING * `,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Equipment not found." });
    }
    res.status(200).json({
      message: "Equipment deleted successfully.",
      equipment: result.rows[0],
    });
  } catch (error) {
    console.error("Delete equipment error:", error);
    // Because project_equipment uses ON DELETE RESTRICT
    if (error.code === "23503") {
      return res.status(409).json({
        message:
          "Equipment cannot be deleted because it has project history. Retire the equipment instead.",
      });
    }
    res.status(500).json({ message: "Server Error" });
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
