import { getPostById } from "../repositories/posts.repository.mjs";
import { POST_MESSAGES, POST_VALIDATION_MESSAGE } from "../constants/messages.mjs";

const isProvided = (value) => value !== undefined && value !== null;

const validationError = (res, detail) =>
  res.status(400).json({
    message: POST_VALIDATION_MESSAGE,
    detail,
  });

/**
 * Validation ร่วมสำหรับ body ของ post (create/update แบบ multipart)
 * ตรวจ title, image (URL หรือ file), category_id, description, content, status_id
 * Mutate req.body.category_id และ req.body.status_id เป็น number
 * @returns truthy ถ้า invalid (ส่ง response แล้ว), falsy ถ้า valid
 */
function validatePostBodyFields(req, res, body, file) {
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

  return null;
}

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
 */
export const postBodyValidationWithOptionalFile = (req, res, next) => {
  const body = req.body;
  const file = req.files?.imageFile?.[0];
  if (validatePostBodyFields(req, res, body, file)) {
    return;
  }
  next();
};

/**
 * Validation สำหรับแก้ไขโพสต์ (PUT): รับได้ทั้ง JSON หรือ multipart
 */
export const postBodyValidationForUpdate = (req, res, next) => {
  const body = req.body;
  const file = req.files?.imageFile?.[0];
  if (validatePostBodyFields(req, res, body, file)) {
    return;
  }
  next();
};

/**
 * โหลด post จาก postId แล้วใส่ลง req.post; ถ้าไม่พบหรือ error ส่ง 404/500 และไม่เรียก next()
 */
export const postIdValidation = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: POST_MESSAGES.NOT_FOUND });
    }
    req.post = post;
    next();
  } catch (err) {
    console.error("postIdValidation", err);
    return res.status(500).json({ message: POST_MESSAGES.VALIDATE_ID_ERROR });
  }
};
