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
      [`%${search.trim()}%`],
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
    const { search = "", status = "", condition = "", page = 1 } = req.query;

    const searchValue = String(search).trim();
    const statusValue = String(status).trim();
    const conditionValue = String(condition).trim();
    console.log(searchValue, statusValue);
    // Pagination

    const limit = 10;

    const currentPage = Math.max(parseInt(page) || 1, 1);

    const offset = (currentPage - 1) * limit;

    // Build WHERE conditions
    const values = [];
    const conditions = [];

    // Search equipment name/category
    if (searchValue) {
      values.push(`%${searchValue}%`);

      conditions.push(`
        (
          e.equipment_name ILIKE $${values.length}
          OR e.category ILIKE $${values.length}
        )
      `);
    }

    // Status filter
    if (statusValue) {
      values.push(statusValue);

      conditions.push(`e.status = $${values.length}`);
    }

    // Condition filter
    if (conditionValue) {
      values.push(conditionValue);

      conditions.push(`e.condition = $${values.length}`);
    }

    // WHERE clause
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get equipment
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

      ${whereClause}

      ORDER BY e.created_at DESC

      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    const equipmentValues = [...values, limit, offset];

    const result = await pool.query(equipmentQuery, equipmentValues);

    // Count filtered equipment
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM equipment e
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, values);

    const totalUnits = parseInt(countResult.rows[0].total);

    const totalPages = Math.ceil(totalUnits / limit);

    res.status(200).json({
      equipments: result.rows,

      pagination: {
        currentPage,
        unitsPerPage: limit,
        totalUnits,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Equipment search error:", error);

    res.status(500).json({
      message: "Failed to search equipment.",
    });
  }
};

const projectSearch = async (req, res) => {
  try {
    const { search = "", status = "", location = "", page = 1 } = req.query;

    const searchValue = String(search).trim();
    const statusValue = String(status).trim();
    const locationValue = String(location).trim();
    console.log(searchValue, statusValue);
    console.log(search);
    console.log(location);

    // pagiantion

    const limit = 10;

    const currentPage = Math.max(parseInt(page) || 1, 1);

    const offset = (currentPage - 1) * limit;

    const values = [];
    const conditions = [];

    if (searchValue) {
      values.push(`%${searchValue}%`);
console.log(`%${searchValue}%`)
      conditions.push(`
        (
          p.project_name ILIKE $${values.length}
          OR p.location ILIKE $${values.length}
        )
        `);
    }

    if (statusValue) {
      values.push(statusValue);
      conditions.push(`p.status = $${values.length}`);
    }

    if (locationValue) {
      values.push(`%${location}%`);
      conditions.push(`p.location ILIKE $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const projectQuery = `
      SELECT
        p.id,
        p.project_name,
        p.description,
        p.location,
        p.status,
        p.image,
        p.created_at,
        u.company_id,
        u.username
      FROM projects p
      JOIN users u
        ON p.created_by = u.id
      
        ${whereClause}

      ORDER BY p.created_at DESC

      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    const projectValues = [...values, limit, offset];

    const result = await pool.query(projectQuery, projectValues);

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM projects p
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, values);

    const totalUnits = parseInt(countResult.rows[0].total);

    const totalPages = Math.ceil(totalUnits / limit);

    res.status(200).json({
      projects: result.rows,
      
      pagination: {
        currentPage,
        unitsPerPage: limit,
        totalUnits,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Equipment search error:", error);

    res.status(500).json({
      message: "Failed to search equipment.",
    });
  }
};


const profileSearch = async (req, res) => {
  try {
    const { search = "", email = "", role = "", page = 1 } = req.query;

    const searchValue = String(search).trim();
    const roleValue = String(role).trim();

    // pagiantion

    const limit = 10;

    const currentPage = Math.max(parseInt(page) || 1, 1);

    const offset = (currentPage - 1) * limit;

    const values = [];
    const conditions = [];

    if (searchValue) {
      values.push(`%${searchValue}%`);

      conditions.push(`
        (
          username ILIKE $${values.length}
          OR email ILIKE $${values.length}
        )
        `);
    }

    if (roleValue) {
      values.push(statusValue);
      conditions.push(`role = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const profileQuery = `
      SELECT
        id,
        company_id,
        username,
        email,
        role,
      FROM users
      ${whereClause}
      ORDER BY p.created_at DESC

      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    const profileValues = [...values, limit, offset];

    const result = await pool.query(profileQuery, profileValues);

     const countQuery = `
      SELECT COUNT(*) AS total
      FROM users
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, values);

    const totalUnits = parseInt(countResult.rows[0].total);

    const totalPages = Math.ceil(totalUnits / limit);

    res.status(200).json({
      profiles: result.rows,
      pagination: {
        currentPage,
        unitsPerPage: limit,
        totalUnits,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Equipment search error:", error);

    res.status(500).json({
      message: "Failed to search equipment.",
    });
  }
};

module.exports = {
  searchNameProjects,
  equipmentSearch,
  projectSearch,
  profileSearch,
};
