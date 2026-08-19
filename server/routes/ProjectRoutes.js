const express = require("express");
const authenticationMiddleware = require("../utils/authenticationMiddleware");
const { createProject, getProjects, getProject, updateProject } = require("../controller/ProjectController");
const { uploadProjectImage } = require("../utils/uploadMiddleware");

const router = express.Router();

router.post("/create", authenticationMiddleware,
  uploadProjectImage.single("image"), createProject);
router.get("/:id", authenticationMiddleware, getProject);
router.get("/s/page/:page", authenticationMiddleware, getProjects);
router.post("/update", authenticationMiddleware, updateProject);

module.exports = router;