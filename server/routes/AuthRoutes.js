const express = require("express");
const { registerUser, loginUser, getProfile, getUsers, } = require("../controller/AuthController");
const authenticationMiddleware = require("../utils/authenticationMiddleware");
const { getDashBoard } = require("../controller/DashBoardController");
const { profileSearch } = require("../controller/SearchController");
const router = express.Router();


router.get(
  "/search/pages", authenticationMiddleware, profileSearch
);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticationMiddleware, getProfile);
router.get("/users", authenticationMiddleware, getUsers );

router.get("/dashboard", authenticationMiddleware, getDashBoard);

module.exports = router;