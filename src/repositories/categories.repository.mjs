import pool from "../utils/db.mjs";
import { TABLE_NAME, FIELDS } from "../models/categories.model.mjs";

const CREATE_COLUMNS = [FIELDS.name];

/** Get all categories (for admin list and public dropdown) */
export const getAllCategories = async () => {
  const query = `
    SELECT * FROM ${TABLE_NAME}
    ORDER BY ${FIELDS.id} ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

/** Get a category by id */
export const getCategoryById = async (id) => {
  const query = `SELECT * FROM ${TABLE_NAME} WHERE ${FIELDS.id} = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

/** Create a new category */
export const createCategory = async (body) => {
  const { name } = body;
  const columns = CREATE_COLUMNS.join(", ");
  const placeholders = CREATE_COLUMNS.map((_, i) => `$${i + 1}`).join(", ");
  const query = `
    INSERT INTO ${TABLE_NAME} (${columns})
    VALUES (${placeholders})
    RETURNING *
  `;
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

/** Update a category by id */
export const updateCategory = async (id, body) => {
  const { name } = body;
  const query = `
    UPDATE ${TABLE_NAME}
    SET ${FIELDS.name} = $1
    WHERE ${FIELDS.id} = $2
    RETURNING *
  `;
  const result = await pool.query(query, [name, id]);
  return result.rows[0];
};

/** Delete a category by id */
export const deleteCategory = async (id) => {
  const query = `
    DELETE FROM ${TABLE_NAME}
    WHERE ${FIELDS.id} = $1
    RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
