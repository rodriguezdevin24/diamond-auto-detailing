//authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

require("dotenv").config();

//Login logic

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //Generate access token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } //token expires in 2 hours
    );

    //Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    //Save refresh token in user's record
    user.refreshToken = refreshToken;
    await user.save();

    //Send both tokens back to the client
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//Refresh token logic

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    //Verifies the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    //Find user by ID included in the refresh token
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};



//Logout logic

exports.logout = async (req, res) => {
  const { userId } = req.body;


  try {
    //Find the user and invalidate the refresh token
    await User.findByIdAndUpdate(userId, { refreshToken: "" });

    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    res.status(500).json({ message: "Error during logout" });
  }
};