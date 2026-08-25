const express = require("express");
const authenticationMiddleware = require("../utils/authenticationMiddleware");
const { createProject, getProjects, getProject, updateProject } = require("../controller/ProjectController");
const { uploadProjectImage } = require("../utils/uploadMiddleware");
const { searchNameProjects } = require("../controller/SearchController");

const router = express.Router();

router.get(
  "/search",
  authenticationMiddleware,
  searchNameProjects
);

router.post("/create", authenticationMiddleware,
  uploadProjectImage.single("image"), createProject);
router.get("/:id", authenticationMiddleware, getProject);
router.get("/s/page/:page", authenticationMiddleware, getProjects);
router.post("/update", authenticationMiddleware, updateProject);



module.exports = router;