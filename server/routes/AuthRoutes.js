const express = require("express");
const { registerUser, loginUser, getProfile, getUsers, } = require("../controller/AuthController");
const authenticationMiddleware = require("../utils/authenticationMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticationMiddleware, getProfile);
router.get("/users", authenticationMiddleware, getUsers );

module.exports = router;