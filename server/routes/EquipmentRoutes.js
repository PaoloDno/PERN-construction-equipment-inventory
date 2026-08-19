const express = require("express");


const authenticationMiddleware = require("../utils/authenticationMiddleware.js");
const { getEquipment, getEquipments, createEquipment, updateEquipment, deleteEquipment } = require("../controller/EquipmentController.js");
const { uploadEquipmentImage } = require("../utils/uploadMiddleware.js");


const router = express.Router();

router.get("/", authenticationMiddleware, getEquipments);
router.get("/:id", authenticationMiddleware, getEquipment);
router.post("/", authenticationMiddleware,
  uploadEquipmentImage.single("image"), createEquipment);
router.put("/:id", authenticationMiddleware,
  uploadEquipmentImage.single("image"), updateEquipment);
router.delete("/:id", authenticationMiddleware, deleteEquipment);

module.exports = router;