const express = require("express");
const cors = require("cors");

const path = require("path");

const connectDB = require("./utils/db.js");

require("dotenv").config();

// routers
const authRoutes = require("./routes/AuthRoutes.js");
const equipmentRoutes = require("./routes/EquipmentRoutes");
const projectRoutes = require("./routes/ProjectRoutes.js");

const app = express();
const PORT = 5000;

connectDB();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/project", projectRoutes);


// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});