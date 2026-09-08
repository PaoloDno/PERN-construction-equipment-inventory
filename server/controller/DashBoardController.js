const { pool } = require("../utils/db");

const getDashBoard = async (req, res) => {
  try {
    const equipmentCountQuery = `
      SELECT
        COUNT(*) AS Total,
        COUNT(*) FILTER (WHERE status = 'available') AS available,
        COUNT(*) FILTER (WHERE status = 'borrowed') AS borrowed,
        COUNT(*) FILTER (WHERE status = 'maintenance') AS maintenance
      FROM equipment
    `;

    const projectCountQuery = `
      SELECT 
        COUNT(*) AS Total,
        COUNT(*) FILTER (WHERE status = 'planning') AS planning,
        COUNT(*) FILTER (WHERE status = 'active') AS active,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed,
        COUNT(*) FILTER (WHERE status = 'onhold') AS onhold,
        COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled
      FROM projects
    `;
    const userCountQuery = `
      SELECT COUNT(*) AS total
      FROM users
    `;

    const recentEquipmentQuery = `
      SELECT
        pe.status AS project_equipment_status,
        pe.condition_before,
        pe.condition_after,
        pe.borrowed_at,
        pe.returned_at,

        CASE
            WHEN pe.returned_at IS NOT NULL
                AND pe.returned_at >= pe.borrowed_at
            THEN 'returned'
            ELSE 'borrowed'
        END AS activity_type,

        GREATEST(
            pe.borrowed_at,
            COALESCE(pe.returned_at, pe.borrowed_at)
        ) AS activity_date,

        e.id AS equipment_id,
        e.equipment_name,
        e.status AS equipment_status,
        e.image AS equipment_image,

        u.id AS user_id,
        u.username,

        p.id AS project_id,
        p.project_name,
        p.location,
        p.status AS project_status

    FROM project_equipment pe

    LEFT JOIN users u
        ON pe.user_id = u.id

    LEFT JOIN equipment e
        ON pe.equipment_id = e.id

    LEFT JOIN projects p
        ON pe.project_id = p.id

    ORDER BY activity_date DESC
    LIMIT 5;
    `;

    const [equipmentResult, projectResult, userResult, recentResult] =
      await Promise.all([
        pool.query(equipmentCountQuery),
        pool.query(projectCountQuery),
        pool.query(userCountQuery),
        pool.query(recentEquipmentQuery),
      ]);

    res.status(200).json({
      dashboard: {
        equipmentsCount: equipmentResult.rows[0],
        projectsCount: projectResult.rows[0],
        userResult: userResult.rows[0],
        equipments: recentResult.rows,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard data.",
    });
  }
};

module.exports = {
  getDashBoard,
};
