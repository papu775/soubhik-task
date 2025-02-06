const express = require("express");
const app = express();
const { registerUser, loginUser } = require("../controllers/auth.controller");
const { getProfile, updateUser} = require("../controllers/user.controller");
const upload = require("../middleware/multer");
const auth = require("../middleware/jwt_verify");


// Register route
app.post("/register", upload.single("profileImage"), registerUser);


// Login route
app.post("/login", loginUser);

//Update profile
app.post("/update-profile",auth, upload.single("profileImage"), updateUser);

//get profile details
app.get("/profile",auth, getProfile);

module.exports = app;

