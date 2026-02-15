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

/**
 * อัปเดตโปรไฟล์ (profile_pic, name) ตาม id
 * @param {string} id - user id
 * @param {{ profile_pic?: string, name?: string }} updates
 * @returns {Promise<object>} แถวที่อัปเดต
 */
export const updateProfile = async (id, updates) => {
  const { profile_pic, name } = updates;
  const setParts = [];
  const values = [];
  let pos = 1;
  if (profile_pic !== undefined) {
    setParts.push(`${FIELDS.profilePic} = $${pos}`);
    values.push(profile_pic);
    pos += 1;
  }
  if (name !== undefined) {
    setParts.push(`${FIELDS.name} = $${pos}`);
    values.push(name);
    pos += 1;
  }
  if (setParts.length === 0) return (await findById(id)) ?? null;
  values.push(id);
  const query = `
    UPDATE ${TABLE_NAME}
    SET ${setParts.join(", ")}
    WHERE ${FIELDS.id} = $${pos}
    RETURNING *
  `;
  const result = await pool.query(query, values);
  return result.rows[0];
};
