import express from "express";
import "dotenv/config"
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const PORT = process.env.PORT || 3000
const app = express()

app.use(helmet())
app.use(morgan("dev"))
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again later."
})
app.use("/api", limiter);

const allowedOrigin = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : "http://localhost:3001";
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

import expenseRouter from "./routes/expense.routes.js";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan";

app.use("/api/auth", authRouter);
app.use("/api/expense", expenseRouter);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Expense Tracker backend is running",
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectDB()
});