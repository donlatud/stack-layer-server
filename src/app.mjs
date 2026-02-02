import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// GET /profiles - ดูข้อมูลโปรไฟล์ของ John
app.get("/profiles", (req, res) => {
  res.status(200).json({
    data: {
      name: "john",
      age: 20,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});