import express from "express";
import "dotenv/config";
import cors from "cors";
import postsRoutes from "./routes/posts.routes.mjs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());

app.use("/posts", postsRoutes);

export default app;

if (process.env.VERCEL !== "1") { app.listen(PORT, () => { console.log(`✅ Server running on http://localhost:${PORT}`); }); }