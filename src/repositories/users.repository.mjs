import pool from "../utils/db.mjs";
import { TABLE_NAME, FIELDS } from "../models/users.model.mjs";

// Find user by username (for duplicate check on register)
export const findByUsername = async (username) => {
  const query = `SELECT * FROM ${TABLE_NAME} WHERE ${FIELDS.username} = $1`;
  const result = await pool.query(query, [username]);
  return result.rows[0];
};

// Find user by id (Supabase auth user id = our users.id)
export const findById = async (id) => {
  const query = `SELECT * FROM ${TABLE_NAME} WHERE ${FIELDS.id} = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Insert a new user row (after Supabase auth signUp)
export const create = async (user) => {
  const { id, username, name, role } = user;
  const query = `
    INSERT INTO ${TABLE_NAME} (${FIELDS.id}, ${FIELDS.username}, ${FIELDS.name}, ${FIELDS.role})
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [id, username, name, role ?? "user"];
  const result = await pool.query(query, values);
  return result.rows[0];
};
