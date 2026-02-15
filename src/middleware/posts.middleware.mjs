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

/**
 * Validation สำหรับสร้างโพสต์แบบ multipart: รับได้ทั้ง image (URL) หรือ imageFile (ไฟล์)
 * ปกติ category_id, status_id จาก form-data เป็น string จึง parse เป็น number ให้
 */
export const postBodyValidationWithOptionalFile = (req, res, next) => {
  const body = req.body;
  const file = req.files?.imageFile?.[0];
  const hasImageUrl = isProvided(body.image) && typeof body.image === "string";
  const hasImageFile = file && Buffer.isBuffer(file.buffer);

  if (!isProvided(body.title)) {
    return validationError(res, "Title is required");
  }
  if (typeof body.title !== "string") {
    return validationError(res, "Title must be a string");
  }

  if (!hasImageUrl && !hasImageFile) {
    return validationError(res, "Image is required: send image (URL) or imageFile (file)");
  }
  if (hasImageUrl && hasImageFile) {
    return validationError(res, "Send either image (URL) or imageFile (file), not both");
  }

  const categoryId = body.category_id != null ? parseInt(body.category_id, 10) : NaN;
  if (!Number.isInteger(categoryId)) {
    return validationError(res, "Category_id is required and must be a number");
  }
  req.body.category_id = categoryId;

  if (!isProvided(body.description)) {
    return validationError(res, "Description is required");
  }
  if (typeof body.description !== "string") {
    return validationError(res, "Description must be a string");
  }

  if (!isProvided(body.content)) {
    return validationError(res, "Content is required");
  }
  if (typeof body.content !== "string") {
    return validationError(res, "Content must be a string");
  }

  const statusId = body.status_id != null ? parseInt(body.status_id, 10) : NaN;
  if (!Number.isInteger(statusId)) {
    return validationError(res, "Status_id is required and must be a number");
  }
  req.body.status_id = statusId;

  next();
};

/**
 * Validation สำหรับแก้ไขโพสต์ (PUT): รับได้ทั้ง JSON หรือ multipart
 * ต้องมี image (URL) หรือ imageFile (ไฟล์) อย่างใดอย่างหนึ่ง
 * Parse category_id, status_id เป็น number
 */
export const postBodyValidationForUpdate = (req, res, next) => {
  const body = req.body;
  const file = req.files?.imageFile?.[0];
  const hasImageUrl = isProvided(body.image) && typeof body.image === "string";
  const hasImageFile = file && Buffer.isBuffer(file.buffer);

  if (!isProvided(body.title)) {
    return validationError(res, "Title is required");
  }
  if (typeof body.title !== "string") {
    return validationError(res, "Title must be a string");
  }

  if (!hasImageUrl && !hasImageFile) {
    return validationError(res, "Image is required: send image (URL) or imageFile (file)");
  }
  if (hasImageUrl && hasImageFile) {
    return validationError(res, "Send either image (URL) or imageFile (file), not both");
  }

  const categoryId = body.category_id != null ? parseInt(body.category_id, 10) : NaN;
  if (!Number.isInteger(categoryId)) {
    return validationError(res, "Category_id is required and must be a number");
  }
  req.body.category_id = categoryId;

  if (!isProvided(body.description)) {
    return validationError(res, "Description is required");
  }
  if (typeof body.description !== "string") {
    return validationError(res, "Description must be a string");
  }

  if (!isProvided(body.content)) {
    return validationError(res, "Content is required");
  }
  if (typeof body.content !== "string") {
    return validationError(res, "Content must be a string");
  }

  const statusId = body.status_id != null ? parseInt(body.status_id, 10) : NaN;
  if (!Number.isInteger(statusId)) {
    return validationError(res, "Status_id is required and must be a number");
  }
  req.body.status_id = statusId;

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