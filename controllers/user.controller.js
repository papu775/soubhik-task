const httpStatus = require("http-status").default;
const path = require("path");
const fs = require("fs");
const User = require("../models/Users");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assume the user ID is available in the request object after authentication
    const user = await User.findById(userId);

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send({
         success: false,
         status: httpStatus.NOT_FOUND,
         message: "User not found" 
        });
    }

    user.profilePicture = `${process.env.BASE_URI}/uploads/${user.profilePicture}`;

    res.status(httpStatus.OK).send({
      success: true,
      status: httpStatus.OK,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      status: httpStatus.INTERNAL_SERVER_ERROR, 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

const updateUser = async (req, res) => {
console.log(req.file);
  try {
    const userId = req.user.id; // Assume the user ID is available in the request object after authentication
    const user = await User.findById(userId);

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send({
         success: false,
         status: httpStatus.NOT_FOUND,
         message: "User not found" 
        });
    }

  

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.file) {
      if (user.profilePicture) {
        const oldImagePath = path.join(__dirname, "../public/uploads", user.profilePicture);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      user.profilePicture = req.file.filename;
    }

    await user.save();
    user.profilePicture = `${process.env.BASE_URI}/uploads/${user.profilePicture}`;

    res.status(httpStatus.OK).send({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      status: httpStatus.INTERNAL_SERVER_ERROR, 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

module.exports = { getProfile, updateUser };

