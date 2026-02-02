import express from "express";
import "dotenv/config";
import cors from "cors";
import postsRoutes from "./routes/postsRoutes.mjs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/posts", postsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});