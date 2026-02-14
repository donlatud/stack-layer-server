import {
  createCommentService,
  getCommentsByPostIdService,
  deleteCommentService,
} from "../services/comments.service.mjs";
import { findById as findUserById } from "../repositories/users.repository.mjs";

/** GET /posts/:postId/comments */
export const getCommentsController = async (req, res) => {
  try {
    const { postId } = req.params;
    const postIdNum = parseInt(postId, 10);
    if (Number.isNaN(postIdNum)) {
      return res.status(400).json({ message: "Invalid post id" });
    }
    const comments = await getCommentsByPostIdService(postIdNum);
    return res.status(200).json({ data: comments });
  } catch (err) {
    console.error("getCommentsController", err);
    return res.status(500).json({ message: "Server could not load comments" });
  }
};

/** POST /posts/:postId/comments — require auth */
export const postCommentController = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { comment_text: commentText } = req.body;
    const postIdNum = parseInt(postId, 10);
    if (Number.isNaN(postIdNum)) {
      return res.status(400).json({ message: "Invalid post id" });
    }
    const comment = await createCommentService(postIdNum, userId, commentText);
    const user = await findUserById(userId);
    const data = {
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      comment_text: comment.comment_text,
      created_at: comment.created_at,
      user_name: user?.name ?? "User",
      user_profile_pic: user?.profile_pic ?? null,
    };
    return res.status(201).json({ message: "Comment created", data });
  } catch (err) {
    console.error("postCommentController", err);
    return res.status(500).json({ message: "Server could not create comment" });
  }
};

/** DELETE /comments/:commentId — require auth, only owner */
export const deleteCommentController = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const commentIdNum = parseInt(commentId, 10);
    if (Number.isNaN(commentIdNum)) {
      return res.status(400).json({ message: "Invalid comment id" });
    }
    const deleted = await deleteCommentService(commentIdNum, userId);
    if (!deleted) {
      return res.status(404).json({ message: "Comment not found" });
    }
    return res.status(200).json({ message: "Comment deleted", data: deleted });
  } catch (err) {
    if (err.statusCode === 403) {
      return res.status(403).json({ message: "You can only delete your own comment" });
    }
    console.error("deleteCommentController", err);
    return res.status(500).json({ message: "Server could not delete comment" });
  }
};
