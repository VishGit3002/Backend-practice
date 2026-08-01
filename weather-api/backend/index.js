import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import weatherRoute from "./routes/routes.js";

const app = express();
const port = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3001";

// ─── Security: HTTP headers ───────────────────────────────────────────────────
app.use(helmet());

// ─── Security: Rate limiting (30 requests per 15 minutes per IP) ──────────────
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ─── Security: Strict CORS ────────────────────────────────────────────────────
app.use(cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
}));

// ─── Body parser with size limit ─────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));

app.use("/api", weatherRoute);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

