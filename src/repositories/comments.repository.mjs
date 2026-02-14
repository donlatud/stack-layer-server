import pool from "../utils/db.mjs";
import { TABLE_NAME, FIELDS } from "../models/comments.model.mjs";
import { TABLE_NAME as USERS_TABLE, FIELDS as USER_FIELDS } from "../models/users.model.mjs";

/** Create a comment. Returns the new row. */
export const createComment = async (postId, userId, commentText) => {
  const query = `
    INSERT INTO ${TABLE_NAME} (${FIELDS.postId}, ${FIELDS.userId}, ${FIELDS.commentText})
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(query, [postId, userId, commentText]);
  return result.rows[0];
};

/** Get comments for a post with user name and profile_pic, ordered by created_at asc. */
export const getByPostId = async (postId) => {
  const query = `
    SELECT c.${FIELDS.id}, c.${FIELDS.postId}, c.${FIELDS.userId},
           c.${FIELDS.commentText}, c.${FIELDS.createdAt},
           u.${USER_FIELDS.name} AS user_name,
           u.${USER_FIELDS.profilePic} AS user_profile_pic
    FROM ${TABLE_NAME} c
    INNER JOIN ${USERS_TABLE} u ON u.${USER_FIELDS.id} = c.${FIELDS.userId}
    WHERE c.${FIELDS.postId} = $1
    ORDER BY c.${FIELDS.createdAt} ASC
  `;
  const result = await pool.query(query, [postId]);
  return result.rows;
};

/** Get a comment by id (for ownership check). */
export const getById = async (id) => {
  const query = `SELECT * FROM ${TABLE_NAME} WHERE ${FIELDS.id} = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

/** Delete a comment by id. */
export const deleteComment = async (id) => {
  const query = `
    DELETE FROM ${TABLE_NAME}
    WHERE ${FIELDS.id} = $1
    RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
