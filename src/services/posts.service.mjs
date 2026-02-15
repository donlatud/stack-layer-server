import {
  createPost,
  getPostsFiltered,
  getPostById,
  updatePost,
  deletePost,
} from "../repositories/posts.repository.mjs";
import { uploadPostImage } from "./storage.service.mjs";

export const createPostService = async (body, imageFile = null) => {
  const payload = { ...body };
  if (imageFile && imageFile.buffer) {
    const { publicUrl } = await uploadPostImage(
      imageFile.buffer,
      imageFile.originalname,
      imageFile.mimetype
    );
    payload.image = publicUrl;
  }
  const post = await createPost(payload);
  return post;
};

export const getPostByIdService = async (postId) => {
  try {
    const post = await getPostById(postId);
    return post;
  } catch (error) {
    return error;
  }
};

export const updatePostService = async (postId, body) => {
  try {
    const post = await updatePost(postId, body);
    return post;
  } catch (error) {
    return error;
  }
};

export const deletePostService = async (postId) => {
  try {
    const post = await deletePost(postId);
    return post;
  } catch (error) {
    return error;
  }
};

export const getPostsService = async (query) => {
  try {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 6));
    const offset = (page - 1) * limit;
    const category = query.category ?? null;
    const keyword = query.keyword ?? null;

    const { total, rows } = await getPostsFiltered({
      limit,
      offset,
      category: category === "" ? null : category,
      keyword: keyword === "" ? null : keyword,
    });

    const totalPages = Math.ceil(total / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      totalPosts: total,
      totalPages,
      currentPage: page,
      limit,
      posts: rows,
      nextPage,
    };
  } catch (error) {
    return error;
  }
};
