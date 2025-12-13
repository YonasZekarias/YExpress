const User = require('../../models/User');
const { generateToken, refreshToken } = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");
const logger = require("../../utils/logger");
const jwt = require("jsonwebtoken");



const sendEmail = async (to, subject, message) => {

  logger.info(`EMAIL SENT TO ${to} | SUBJECT: ${subject} | MESSAGE: ${message}`);
};



exports.register = async (req, res) => {
  try {
    const { username,email, phone, password, role } = req.body;


    const userExist = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExist)
      return res.status(400).json({ message: "User already exists" });


    const verificationCode = "123456"; // radome code genenrate 
    const user = await User.create({
      username,
      email,
      phone,
      password,
      role,
      verificationCode,
      isVerified: false,
    });

    // Send verification email
    await sendEmail(
      email,
      "Verify your account",
      `Your verification code is: ${verificationCode}`
    );

    res.status(201).json({
      status: "success",
      message: "Verification code sent to your email.",
      data: { userId: user._id },
    });

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};



exports.verifyEmail = async (req, res) => {
  try {
    verificationCode = "123456"; // 🔥 Testing code
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (verificationCode !== code)
      return res.status(400).json({ message: "Invalid code" });

    user.verified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });

  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};



exports.login = async (req, res) => {
  try {
    const { email,  password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    // Block login if not verified
    if (!user.verified)
      return res.status(403).json({
        message: "Please verify your email first.",
      });

    // Generate tokens
    const token = generateToken(user);
    const refreshTokenValue = refreshToken(user);

    await User.updateOne(
      { _id: user._id },
      { refreshToken: refreshTokenValue }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    res.cookie("refreshToken", refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    res.status(200).json({
      status: "success",
      token,
      data: {
        userId: user._id,
        role: user.role,
      },
    });

  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};



exports.refreshToken = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie)
      return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ message: "Invalid refresh token" });

    const newAccessToken = generateToken(user);

    res.status(200).json({
      status: "success",
      token: newAccessToken,
      data: {
        userId: user._id,
        role: user.role,
      },
    });

  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Invalid refresh token" });
  }
};



exports.logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
};



exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const code = "123456"; // 🔥 Testing code
    const expires = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = code;
    user.resetPasswordExpires = expires;
    await user.save();

    // Send email with reset code
    await sendEmail(
      email,
      "Password Reset Code",
      `Your password reset code is: ${code}`
    );

    res.status(200).json({
      status: "success",
      message: "Password reset code sent to your email.",
    });

  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};