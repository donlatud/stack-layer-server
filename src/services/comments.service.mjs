import {
  createComment as createCommentRepo,
  getByPostId,
  getById,
  deleteComment as deleteCommentRepo,
} from "../repositories/comments.repository.mjs";

export const createCommentService = async (postId, userId, commentText) => {
  const comment = await createCommentRepo(postId, userId, commentText);
  return comment;
};

export const getCommentsByPostIdService = async (postId) => {
  const rows = await getByPostId(postId);
  return rows.map((row) => ({
    id: row.id,
    post_id: row.post_id,
    user_id: row.user_id,
    comment_text: row.comment_text,
    created_at: row.created_at,
    user_name: row.user_name,
    user_profile_pic: row.user_profile_pic,
  }));
};

export const getCommentByIdService = async (commentId) => {
  return getById(commentId);
};

export const deleteCommentService = async (commentId, userId) => {
  const comment = await getById(commentId);
  if (!comment) return null;
  if (comment.user_id !== userId) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
  return deleteCommentRepo(commentId);
};
