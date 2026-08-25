const { pool } = require("../utils/db.js");

// GET /searchprojects
const searchNameProjects = async (req, res) => {
  try {
    const { search = "" } = req.query;

    console.log("Search query:", search);

    const result = await pool.query(
      `
      SELECT
        id,
        project_name
      FROM projects
      WHERE project_name ILIKE $1
      ORDER BY project_name ASC
      LIMIT 20
      `,
      [`%${search.trim()}%`]
    );

    res.status(200).json({
      projectsName: result.rows,
    });

  } catch (error) {
    console.error("Search projects error:", error);

    res.status(500).json({
      message: "Failed to search projects.",
    });
  }
};

const equipmentSearch = async (req, res) => {
  try {

    const {
      search = "",
      status = "",
      condition = "",
      page = 1,
    } = req.query;

    // Pagination

    const limit = 10;

    const currentPage = Math.max(
      parseInt(page) || 1,
      1
    );

    const offset =
      (currentPage - 1) * limit;

    // Build WHERE conditions

    const values = [];
    const conditions = [];


    // Search equipment name/category

    if (search.trim()) {

      values.push(
        `%${search.trim()}%`
      );

      conditions.push(`
        (
          e.equipment_name ILIKE $${values.length}
          OR e.category ILIKE $${values.length}
        )
      `);
    }

    // Status filter

    if (status.trim()) {

      values.push(
        status.trim()
      );

      conditions.push(
        `e.status = $${values.length}`
      );
    }


    // Condition filter

    if (condition.trim()) {

      values.push(
        condition.trim()
      );

      conditions.push(
        `e.condition = $${values.length}`
      );
    }


    // -----------------------------
    // WHERE clause
    // -----------------------------

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";


    // -----------------------------
    // Get equipment
    // -----------------------------

    const equipmentQuery = `
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
        u.company_id

      FROM equipment e

      JOIN users u
        ON e.created_by = u.id

      ${whereClause}

      ORDER BY e.created_at DESC

      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;


    const equipmentValues = [
      ...values,
      limit,
      offset
    ];


    const result = await pool.query(
      equipmentQuery,
      equipmentValues
    );


    // -----------------------------
    // Count filtered equipment
    // -----------------------------

    const countQuery = `
      SELECT COUNT(*) AS total

      FROM equipment e

      ${whereClause}
    `;


    const countResult = await pool.query(
      countQuery,
      values
    );


    const totalEquipments =
      parseInt(
        countResult.rows[0].total
      );


    const totalPages =
      Math.ceil(
        totalEquipments / limit
      );


    // -----------------------------
    // Response
    // -----------------------------

    res.status(200).json({

      equipments: result.rows,

      pagination: {
        currentPage,
        equipmentsPerPage: limit,
        totalEquipments,
        totalPages,
      },

    });

  } catch (error) {

    console.error(
      "Equipment search error:",
      error
    );

    res.status(500).json({
      message: "Failed to search equipment.",
    });
  }
};


module.exports = {
  searchNameProjects,
  equipmentSearch,
}