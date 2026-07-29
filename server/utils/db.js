require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.HOST || "localhost",
  user: process.env.USER || "postgres",
  port: process.env.DB_PORT || "5432",
  password: process.env.PASSWORD ,
  database: process.env.DATABASE ,
});

const connectDB = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("PostgreSQL Connected");
  } catch (error) {
    console.error("Database Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.pool = pool;