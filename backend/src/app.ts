import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import recipeRoutes from "./routes/recipes.js";
import folderRoutes from "./routes/folders.js";
import mealPlanRoutes from "./routes/mealPlans.js";
import uploadRoutes from "./routes/upload.js";
import aiRoutes from "./routes/ai.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes — auth must come before express.json() would interfere,
// but Better Auth handles its own body parsing internally
app.use(authRoutes);
app.use(recipeRoutes);
app.use(folderRoutes);
app.use(mealPlanRoutes);
app.use(uploadRoutes);
app.use(aiRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
