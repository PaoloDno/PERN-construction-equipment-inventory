const { pool } = require("../utils/db.js");

const createProject = async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
  try {
    const {
      project_name,
      description,
      location,
      status,
    } = req.body;

    if (!project_name) {
      return res.status(400).json({
        message: "Project name is required.",
      });
    }

    const image = req.file
      ? `/uploads/projects/${req.file.filename}`
      : null;

    const result = await pool.query(
      `
      INSERT INTO projects
      (
        project_name,
        description,
        location,
        status,
        image,
        created_by
      )
      VALUES
      ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        project_name,
        description,
        location,
        status || "Active",
        image,
        req.user.id,
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    console.log(`Route Parameters: ${JSON.stringify(req.params)}`);

    const page = Math.max(parseInt(req.params.page) || 1, 1);

    console.log(`Current Page: ${page}`);

    const limit = 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `
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
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    const countResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM projects
      `
    );

    const totalProjects = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalProjects / limit);
    console.log(`Total Projects: ${totalProjects}, Total Pages: ${totalPages}`);
    console.log(`Projects Retrieved: ${result.rows.length}`);
    res.status(200).json({
      projects: result.rows,
      pagination: {
        currentPage: page,
        projectsPerPage: limit,
        totalProjects,
        totalPages,
      },
    });

  } catch (error) {
    console.error("Get Projects Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getProject = async (req, res) => {
  try {
    const result = await pool.query(
      `
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
      WHERE p.id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      project_name,
      description,
      location,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE projects
      SET
        project_name = $1,
        description = $2,
        location = $3,
        status = $4
      WHERE id = $5
      RETURNING *
      `,
      [
        project_name,
        description,
        location,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
}; 