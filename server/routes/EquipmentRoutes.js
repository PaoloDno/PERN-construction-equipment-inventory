const express = require("express");


const authenticationMiddleware = require("../utils/authenticationMiddleware.js");
const { getEquipment, getEquipments, createEquipment, updateEquipment, deleteEquipment, borrowEquipment, returnEquipment, getEquipmentHistory } = require("../controller/EquipmentController.js");
const { uploadEquipmentImage } = require("../utils/uploadMiddleware.js");


const router = express.Router();

router.get("/page/:page", authenticationMiddleware, getEquipments);
router.get("/:id", authenticationMiddleware, getEquipment);
router.post("/", authenticationMiddleware,
  uploadEquipmentImage.single("image"), createEquipment);
router.put("/:id", authenticationMiddleware,
  uploadEquipmentImage.single("image"), updateEquipment);
router.post("/borrow/:id", authenticationMiddleware, 
  uploadEquipmentImage.single("image"), borrowEquipment);
router.post("/return/:id", authenticationMiddleware, 
  uploadEquipmentImage.single("image"), returnEquipment);
router.get("/history/:id", authenticationMiddleware, 
  uploadEquipmentImage.single("image"), getEquipmentHistory);
router.delete("/:id", authenticationMiddleware, deleteEquipment);

module.exports = router;