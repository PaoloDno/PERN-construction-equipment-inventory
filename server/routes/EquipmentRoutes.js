const express = require("express");

const {
  getEquipments,
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} = require("../controllers/EquipmentController");

const { protect } = require("../middleware/AuthMiddleware");

const router = express.Router();

router.get("/", protect, getEquipments);

router.get("/:id", protect, getEquipment);

router.post("/", protect, createEquipment);

router.put("/:id", protect, updateEquipment);

router.delete("/:id", protect, deleteEquipment);

module.exports = router;