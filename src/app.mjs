import express from "express";
import "dotenv/config";
import cors from "cors";
import postsRoutes from "./routes/posts.routes.mjs";
import categoriesRoutes from "./routes/categories.routes.mjs";
import commentsRoutes from "./routes/comments.routes.mjs";
import authRoutes from "./routes/auth.routes.mjs";
import protectedRoutes from "./routes/protected.routes.mjs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());

// Public and resource routes
app.use("/posts", postsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/comments", commentsRoutes);
app.use("/auth", authRoutes);

// Protected and admin routes
app.use("/", protectedRoutes);

export default app;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}