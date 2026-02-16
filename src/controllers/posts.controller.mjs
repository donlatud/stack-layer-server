import {
  createPostService,
  getPostsService,
  updatePostService,
  deletePostService,
} from "../services/posts.service.mjs";
import { getLikeInfoService, getLikesForPostsService } from "../services/likes.service.mjs";
import { POST_MESSAGES } from "../constants/messages.mjs";

const isStorageError = (err) =>
  err?.message && (err.message.includes("storage") || err.message.includes("Bucket"));

export const createPostController = async (req, res) => {
  try {
    const body = req.body;
    const imageFile = req.files?.imageFile?.[0] ?? null;
    await createPostService(body, imageFile);
    return res.status(201).json({ message: POST_MESSAGES.CREATED });
  } catch (err) {
    console.error("createPostController", err);
    const message = isStorageError(err)
      ? POST_MESSAGES.UPLOAD_IMAGE_ERROR
      : POST_MESSAGES.CREATE_ERROR;
    return res.status(500).json({ message });
  }
};

export const getPostByIdController = async (req, res) => {
  try {
    const post = req.post;
    const userId = req.user?.id ?? null;
    const likeInfo = await getLikeInfoService(post.id, userId);
    const data = { ...post, ...likeInfo };
    return res.status(200).json({ data });
  } catch (err) {
    console.error("getPostByIdController", err);
    return res.status(500).json({ message: POST_MESSAGES.READ_ERROR });
  }
};

export const updatePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const body = req.body;
    const imageFile = req.files?.imageFile?.[0] ?? null;
    await updatePostService(postId, body, imageFile);
    return res.status(200).json({ message: POST_MESSAGES.UPDATED });
  } catch (err) {
    console.error("updatePostController", err);
    const message = isStorageError(err)
      ? POST_MESSAGES.UPLOAD_IMAGE_ERROR
      : POST_MESSAGES.UPDATE_ERROR;
    return res.status(500).json({ message });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    await deletePostService(postId);
    return res.status(200).json({ message: POST_MESSAGES.DELETED });
  } catch (err) {
    console.error("deletePostController", err);
    return res.status(500).json({ message: POST_MESSAGES.DELETE_ERROR });
  }
};

export const getPostsController = async (req, res) => {
  try {
    const { page, limit, category, keyword } = req.query;
    const data = await getPostsService({ page, limit, category, keyword });
    const postIds = (data.posts || []).map((p) => p.id);
    const userId = req.user?.id ?? null;
    const { countMap, likedSet } = await getLikesForPostsService(postIds, userId);
    const posts = (data.posts || []).map((p) => ({
      ...p,
      likes_count: countMap.get(p.id) ?? 0,
      is_liked: likedSet.has(p.id),
    }));
    return res.status(200).json({
      data: { ...data, posts },
    });
  } catch (err) {
    console.error("getPostsController", err);
    return res.status(500).json({ message: POST_MESSAGES.READ_ERROR });
  }
};
