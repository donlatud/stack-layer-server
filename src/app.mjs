import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

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