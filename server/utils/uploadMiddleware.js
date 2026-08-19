const multer = require("multer");
const path = require("path");
const fs = require("fs");

const equipmentUploadPath = path.join(
  __dirname,
  "../uploads/equipments"
);

const projectUploadPath = path.join(
  __dirname,
  "../uploads/projects"
);

// Make sure directories exist
if (!fs.existsSync(equipmentUploadPath)) {
  fs.mkdirSync(equipmentUploadPath, { recursive: true });
}

if (!fs.existsSync(projectUploadPath)) {
  fs.mkdirSync(projectUploadPath, { recursive: true });
}

// Allowed image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed"), false);
  }
};

// Equipment storage
const equipmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, equipmentUploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, filename);
  },
});

// Project storage
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, projectUploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, filename);
  },
});

// Equipment upload
const uploadEquipmentImage = multer({
  storage: equipmentStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Project upload
const uploadProjectImage = multer({
  storage: projectStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadEquipmentImage,
  uploadProjectImage,
};