import express from "express";
import {
  deleteUser,
  forgotPassword,
  getUser,
  getUsers,
  login,
  logout,
  register,
  resetPassword,
  updateUser,
  verifyEmail,
} from "../controller/authController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-email/:token", verifyEmail);
router.post("/reset-password/:token", resetPassword);
router.delete("/delete-user/:id", verifyToken, deleteUser);
router.get("/get-users", verifyToken, getUsers);
router.get("/get-user", verifyToken, getUser);
router.post("/update-user", verifyToken, updateUser);
export default router;
