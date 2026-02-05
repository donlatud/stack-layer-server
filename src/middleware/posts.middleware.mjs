import { getPostById } from "../repositories/posts.repository.mjs";

export const postBodyValidation = (req, res, next) => {
  const { title, image, category_id, description, content, status_id } = req.body;
  if (!title || !image || !category_id || !description || !content || !status_id) {
    return res.status(400).json(
      { 
        "message": "Server could not create or update post because there are missing data from client" 
      }
    );
  }
  next();
};

export const postIdValidation = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json(
        {
          "message": "Server could not find a requested post"
        }
      );
    }
  } catch(error) {
    return error;
  }
  next();
};