const express = require("express");
const cors = require("cors");

const connectDB = require("./utils/db.js");

require("dotenv").config();

// routers
const authRoutes = require("./routes/AuthRoutes.js");
const equipmentRoutes = require("./routes/EquipmentRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);

app.use(cors());
app.use(express.json());