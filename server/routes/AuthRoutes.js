const express = require("express");
const { registerUser, loginUser, getProfile } = require("../controller/AuthController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);

module.exports = router;
