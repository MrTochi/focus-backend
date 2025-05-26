import express from "express";
import {
  createTodo,
  deleteTodo,
  editTodo,
  getTodo,
  getTodoById,
  updateTodo,
} from "../controller/todoController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-todo/", verifyToken, createTodo);
router.delete("/delete-todo/:id", verifyToken, deleteTodo);
router.put("/edit-todo/:id", verifyToken, editTodo);
router.get("/get-todos", verifyToken, getTodo);
router.post("/complete-todo/:id", verifyToken, updateTodo);
router.get("/get-todo/:id", verifyToken, getTodoById);

export default router;
