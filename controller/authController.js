import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../model/userModel.js";
import {
  forgotPasswordTemplate,
  verifyEmailTemplate,
  welcomeEmailTemplate,
} from "../utils/emailTemplates.js";
import Notification from "../model/notificationModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import createToken from "../middleware/createToken.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
      success: false,
    });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const isFirstUser = (await User.countDocuments()) === 0;
    const role = isFirstUser ? "admin" : "user";

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      role,
    });
    await newUser.save();

    const verifyLink = `"https://focus-frontend-duma.onrender.com"/verify-email/${verificationToken}`;
    await sendEmail(
      email,
      "Verify Your Email",
      verifyEmailTemplate(name, verifyLink)
    );

    await Notification.create({
      message: `New user registered: ${newUser.name}`,
      type: "user",
      read: false,
    });

    res.status(201).json({
      message: "Registered! Please verify your email.",
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "User is not verified" });
    }

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      token,
      success: true,
      message: "Login successful",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token", success: false });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();
    await sendEmail(
      user.email,
      "Welcome Message",
      welcomeEmailTemplate(user.name)
    );
    res
      .status(200)
      .json({ message: "Email verified successfully!", success: true, user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: err.message, success: false });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ message: "User Logged out successfully!", success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: err.message, success: false });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;

    await user.save();

    const resetUrl = `"https://focus-frontend-duma.onrender.com"/reset-password/${token}`;

    await sendEmail(
      user.email,
      "Password Reset",
      forgotPasswordTemplate(resetUrl, user.name)
    );

    res
      .status(200)
      .json({ message: "Reset link sent to email", success: true, token });
  } catch (err) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false,
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired token", success: false });

    const hashedPass = await bcrypt.hash(password, 10);

    user.password = hashedPass;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();
    res
      .status(200)
      .json({ message: "Password reset successful", success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({
      message: "User fetched successfully!",
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
      success: false,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id: userId, role } = req.user;
  const { id } = req.params;

  if (role !== "admin" && userId !== id) {
    return res.status(403).json({
      message: "You are not authorized to delete this user",
      success: false,
    });
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({
      message: "User deleted successfully!",
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
      success: false,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res
      .status(200)
      .json({ message: "Users fetched successfully!", success: true, users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: err.message, success: false });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { name, password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    if (name) user.name = name;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
          success: false,
        });
      }
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await user.save();

    const { password: _, ...safeUser } = user.toObject(); // exclude password
    res.status(200).json({
      message: "User updated successfully",
      success: true,
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
