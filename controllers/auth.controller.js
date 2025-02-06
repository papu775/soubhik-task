const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const httpStatus = require("http-status").default;
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
    if (error) return res.status(httpStatus.BAD_REQUEST).send({ 
      success: false,
      status: httpStatus.BAD_REQUEST,
      message: error.details[0].message 
    });

    // Check if user exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(httpStatus.BAD_REQUEST).send({ 
      success: false,
      status: httpStatus.BAD_REQUEST,
      message: "User already exists" 
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Handle file upload
    const photoUrl = req.file ? `${req.file.filename}` : "";

    // Create user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      profilePicture: photoUrl,
    });
    await user.save();

    res.status(httpStatus.CREATED).send({
       success: true,
       status: httpStatus.CREATED,
       message: "User registered successfully" 
      });
  } catch (err) {
     res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          success: false,
          status: httpStatus.INTERNAL_SERVER_ERROR,  
          error: err.message 
        });
  }
};

// Login user controller
const loginUser = async (req, res) => {
  try {
    // Validate request
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(httpStatus.BAD_REQUEST).send({ 
      success: false,
      status: httpStatus.BAD_REQUEST,
      message: error.details[0].message 
    });

    // Check user
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(httpStatus.BAD_REQUEST).send({ 
      success: false,
      status: httpStatus.BAD_REQUEST,
      message: "Invalid email or password" 
    });

    // Validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(httpStatus.BAD_REQUEST).send({ 
      success: false,
      status: httpStatus.BAD_REQUEST,
      message: "Invalid email or password" 
    });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });  

    res.status(200).send({
       success: true,
       status: httpStatus.OK,
       message: "Logged in successfully", 
       token: token,
       data: user
       });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      status: httpStatus.INTERNAL_SERVER_ERROR,  
      error: err.message 
    });
  }
};

module.exports = { registerUser, loginUser };

