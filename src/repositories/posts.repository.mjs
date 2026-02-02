import pool from "../utils/db.mjs";
import { TABLE_NAME, FIELDS } from "../models/posts.model.mjs";

const CREATE_COLUMNS = [
  FIELDS.title,
  FIELDS.image,
  FIELDS.categoryId,
  FIELDS.description,
  FIELDS.content,
  FIELDS.statusId,
];

export const createPost = async (body) => {
  const {
    title,
    image,
    category_id,
    description,
    content,
    status_id,
  } = body;
  const columns = CREATE_COLUMNS.join(", ");
  const placeholders = CREATE_COLUMNS.map((_, i) => `$${i + 1}`).join(", ");
  const query = `
    INSERT INTO ${TABLE_NAME} (${columns})
    VALUES (${placeholders})
    RETURNING *
  `;
  const values = [
    title,
    image,
    category_id,
    description,
    content,
    status_id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}