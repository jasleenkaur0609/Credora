import cookieParser from "cookie-parser";
import cors from "cors";
import { checkDatabaseConnection } from "./database/database.service.js";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(cookieParser());

const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(generalRateLimiter);
app.use("/api/v1/auth", authRoutes);

app.get("/api/v1/health", async (_req, res) => {
  const databaseConnected = await checkDatabaseConnection();

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    application: "Credora API",
    database: databaseConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});


export default app;