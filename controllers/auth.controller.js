const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/Users.js");

// Define schemas for validation
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirm_password: Joi.ref("password"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Register user controller
const registerUser = async (req, res) => {
  
  try {
    // Validate request
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Check if user exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).send({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Handle file upload
    const photoUrl = req.file ? `uploads/${req.file.filename}` : "";

    // Create user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      profilePicture: photoUrl,
    });
    await user.save();

    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send({ message: "Internal server error", error: err.message });
  }
};

// Login user controller
const loginUser = async (req, res) => {
  try {
    // Validate request
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Check user
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ message: "Invalid email or password" });

    // Validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ message: "Invalid email or password" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).send({ message: "Logged in successfully", token });
  } catch (err) {
    res.status(500).send({ message: "Internal server error", error: err.message });
  }
};

module.exports = { registerUser, loginUser };

