import { getPostById } from "../repositories/posts.repository.mjs";

const isProvided = (value) => value !== undefined && value !== null;

const validationError = (res, detail) =>
  res.status(400).json({
    message: "Server could not create or update post because there are missing data from client",
    detail,
  });

export const postBodyValidation = (req, res, next) => {
  const { title, image, category_id, description, content, status_id } = req.body;

  if (!isProvided(title)) {
    return validationError(res, "Title is required");
  }
  if (typeof title !== "string") {
    return validationError(res, "Title must be a string");
  }

  if (!isProvided(image)) {
    return validationError(res, "Image is required");
  }
  if (typeof image !== "string") {
    return validationError(res, "Image must be a string");
  }

  if (!isProvided(category_id)) {
    return validationError(res, "Category_id is required");
  }
  if (typeof category_id !== "number") {
    return validationError(res, "Category_id must be a number");
  }

  if (!isProvided(description)) {
    return validationError(res, "Description is required");
  }
  if (typeof description !== "string") {
    return validationError(res, "Description must be a string");
  }

  if (!isProvided(content)) {
    return validationError(res, "Content is required");
  }
  if (typeof content !== "string") {
    return validationError(res, "Content must be a string");
  }

  if (!isProvided(status_id)) {
    return validationError(res, "Status_id is required");
  }
  if (typeof status_id !== "number") {
    return validationError(res, "Status_id must be a number");
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