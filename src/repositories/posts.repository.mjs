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

// Create a new post
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
};

// Get a post by id
export const getPostById = async (id) => {
  const query = `SELECT * FROM ${TABLE_NAME} WHERE ${FIELDS.id} = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Update a post
export const updatePost = async (id, body) => {
  const {
    title,
    image,
    category_id,
    description,
    content,
    status_id,
  } = body;
  const setClause = CREATE_COLUMNS.map((col, i) => `${col} = $${i + 1}`).join(
    ", "
  );
  const query = `
    UPDATE ${TABLE_NAME}
    SET ${setClause}
    WHERE ${FIELDS.id} = $${CREATE_COLUMNS.length + 1}
    RETURNING *
  `;
  const values = [
    title,
    image,
    category_id,
    description,
    content,
    status_id,
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete a post
export const deletePost = async (id) => {
  const query = `
    DELETE FROM ${TABLE_NAME}
    WHERE ${FIELDS.id} = $1
    RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Build the where clause and values for the get posts filtered query
const buildWhereAndValues = (category, keyword) => {
  const conditions = [];
  const values = [];
  if (category != null && category !== "") {
    conditions.push(`${FIELDS.categoryId} = $${values.length + 1}`);
    values.push(category);
  }
  if (keyword != null && keyword !== "") {
    const pattern = `%${keyword}%`;
    conditions.push(
      `(${FIELDS.title} ILIKE $${values.length + 1} OR ${FIELDS.description} ILIKE $${values.length + 1} OR ${FIELDS.content} ILIKE $${values.length + 1})`
    );
    values.push(pattern);
  }
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { whereClause, values };
};

// Get posts filtered (accepts computed limit/offset; no business rules here)
export const getPostsFiltered = async ({ limit, offset, category, keyword }) => {
  const { whereClause, values } = buildWhereAndValues(category, keyword);

  const countQuery = `SELECT COUNT(*)::int as total FROM ${TABLE_NAME} ${whereClause}`;
  const countResult = await pool.query(countQuery, values);
  const total = countResult.rows[0]?.total ?? 0;

  const dataValues = [...values, limit, offset];
  const limitParam = dataValues.length - 1;
  const offsetParam = dataValues.length;
  const dataQuery = `
    SELECT * FROM ${TABLE_NAME}
    ${whereClause}
    ORDER BY ${FIELDS.id} DESC
    LIMIT $${limitParam} OFFSET $${offsetParam}
  `;
  const dataResult = await pool.query(dataQuery, dataValues);

  return { total, rows: dataResult.rows };
};