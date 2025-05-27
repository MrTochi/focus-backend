import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import todoRoutes from "./routes/todoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDb } from "./db/connectDb.js";
import "./utils/jobs/reminderJob.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://focus-frontend-duma.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is  running on PORT:${PORT}`);
});
