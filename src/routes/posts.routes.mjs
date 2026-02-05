import express from "express";
import {
  createPostController,
  getPostsController,
  getPostByIdController,
  updatePostController,
  deletePostController,
} from "../controllers/posts.controller.mjs";
import { postBodyValidation, postIdValidation } from "../middleware/posts.middleware.mjs";

const router = express.Router();

router.post("/", postBodyValidation, createPostController);
router.get("/", getPostsController);
router.get("/:postId", postIdValidation, getPostByIdController);
router.put("/:postId",postBodyValidation, postIdValidation, updatePostController);
router.delete("/:postId", postIdValidation, deletePostController);

export default router;
