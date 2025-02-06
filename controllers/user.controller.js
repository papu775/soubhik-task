
const User = require("../models/Users");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assume the user ID is available in the request object after authentication
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.profilePicture = `http://localhost:5000/${user.profilePicture.replace("src/", "")}`;

    res.status(200).send({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).send({ message: "Internal server error", error: err.message });
  }
};

const updateUser = async (req, res) => {
  // try {
  //   const userId = req.user.id; // Assume the user ID is available in the request object after authentication
  //   const user = await User.findById(userId);

  //   if (!user) {
  //     return res.status(404).send({ message: "User not found" });
  //   }

  //   if (req.file) {
  //     user.profilePicture = `http://localhost:5000/${req.file.path}`;
  //   }

  //   user.name = req.body.name || user.name;
  //   user.email = req.body.email || user.email;

  //   await user.save();

  //   res.status(200).send({
  //     success: true,
  //     message: "User profile updated successfully",
  //     data: user,
  //   });
  // } catch (err) {
  //   res.status(500).send({ message: "Internal server error", error: err.message });
  // }
};

module.exports = { getProfile, updateUser };

