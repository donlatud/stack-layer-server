import express from "express";
import { createPostController } from "../controllers/posts.controller.mjs";

const router = express.Router();

router.post("/", createPostController);

export default router;
