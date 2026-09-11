const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

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

const allowedOrigins = [
  "http://localhost:5173",
  "https://pern-construction-equipment-inventory-3p6d.onrender.com"
]


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

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