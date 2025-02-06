const express = require("express");
const app = express();
const { registerUser, loginUser } = require("../controllers/auth.controller");
const { getProfile, updateUser} = require("../controllers/user.controller");
const { getAllCategories,createCategory } = require("../controllers/category.controller");
const { uploadQuestions,getAllQuestions } = require("../controllers/question.controller");
const uploadImage = require("../middleware/multerImage");
const uploadCsv  = require("../middleware/multerCsv");
const auth = require("../middleware/jwtVerify");


// Register route
app.post("/register", uploadImage.single("profileImage"), registerUser);


// Login route
app.post("/login", loginUser);

//Update profile
app.put("/update-profile",auth, uploadImage.single("profileImage"), updateUser);

//get profile details
app.get("/profile",auth, getProfile);

//create category
app.post("/create-category",auth, createCategory);

//get all categories
app.get("/categories",auth, getAllCategories);

//upload questions
app.post("/upload-questions",auth, uploadCsv.single("csvFile"), uploadQuestions);

//list all questions each category
app.get("/list-questions",auth, getAllQuestions);




module.exports = app;

