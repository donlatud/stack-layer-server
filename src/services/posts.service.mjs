import { createPost } from "../repositories/posts.repository.mjs";

const REQUIRED_FIELDS = [
  "title",
  "image",
  "category_id",
  "description",
  "content",
  "status_id",
];
export const createPostService = async (body) => {
  const { title, image, category_id, description, content, status_id } = body;

  const isMissing = REQUIRED_FIELDS.some(
    (field) =>
      body[field] == null ||
      (typeof body[field] === "string" && body[field].trim() === "") ||
      (typeof body[field] === "number" && Number.isNaN(body[field]))
  );
  if (isMissing) {
    const err = new Error();
    err.statusCode = 400;
    throw err;
  }

  try {
    return await createPost({
      title,
      image,
      category_id,
      description,
      content,
      status_id,
    });
  } catch (dbError) {
    console.error("DB error:", dbError);   // เพิ่มบรรทัดนี้
    const err = new Error();
    err.statusCode = 500;
    throw err;
  }
};
