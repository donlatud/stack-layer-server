import express from "express";
import { deleteCommentController } from "../controllers/comments.controller.mjs";
import protectUser from "../middleware/protectUser.mjs";

const router = express.Router();

router.delete("/:commentId", protectUser, deleteCommentController);

export default router;
