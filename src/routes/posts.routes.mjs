import express from "express";
import {
  createPostController,
  getPostsController,
  getPostByIdController,
  updatePostController,
  deletePostController,
} from "../controllers/posts.controller.mjs";
import {
  postLikeController,
  deleteLikeController,
} from "../controllers/likes.controller.mjs";
import {
  getCommentsController,
  postCommentController,
} from "../controllers/comments.controller.mjs";
import { postBodyValidation, postIdValidation } from "../middleware/posts.middleware.mjs";
import { commentBodyValidation } from "../middleware/comments.middleware.mjs";
import protectUser from "../middleware/protectUser.mjs";
import optionalProtectUser from "../middleware/optionalProtectUser.mjs";

const router = express.Router();

router.post("/", postBodyValidation, createPostController);
router.get("/", optionalProtectUser, getPostsController);
router.get("/:postId", postIdValidation, optionalProtectUser, getPostByIdController);
router.put("/:postId", postBodyValidation, postIdValidation, updatePostController);
router.delete("/:postId", postIdValidation, deletePostController);

router.post("/:postId/like", postIdValidation, protectUser, postLikeController);
router.delete("/:postId/like", postIdValidation, protectUser, deleteLikeController);

router.get("/:postId/comments", postIdValidation, getCommentsController);
router.post("/:postId/comments", postIdValidation, protectUser, commentBodyValidation, postCommentController);

export default router;
