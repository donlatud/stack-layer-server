import pool from "../utils/db.mjs";
import { TABLE_NAME, FIELDS } from "../models/likes.model.mjs";

/** Add a like (user_id + post_id). */
export const addLike = async (postId, userId) => {
  const query = `
    INSERT INTO ${TABLE_NAME} (${FIELDS.postId}, ${FIELDS.userId})
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await pool.query(query, [postId, userId]);
  return result.rows[0];
};

/** Remove a like. */
export const removeLike = async (postId, userId) => {
  const query = `
    DELETE FROM ${TABLE_NAME}
    WHERE ${FIELDS.postId} = $1 AND ${FIELDS.userId} = $2
    RETURNING *
  `;
  const result = await pool.query(query, [postId, userId]);
  return result.rows[0];
};

/** Count likes for a single post. */
export const countByPostId = async (postId) => {
  const query = `
    SELECT COUNT(*)::int AS count
    FROM ${TABLE_NAME}
    WHERE ${FIELDS.postId} = $1
  `;
  const result = await pool.query(query, [postId]);
  return result.rows[0]?.count ?? 0;
};

/** Check if user has liked a post. */
export const hasUserLiked = async (postId, userId) => {
  const query = `
    SELECT 1 FROM ${TABLE_NAME}
    WHERE ${FIELDS.postId} = $1 AND ${FIELDS.userId} = $2
    LIMIT 1
  `;
  const result = await pool.query(query, [postId, userId]);
  return result.rows.length > 0;
};

/** Count likes for multiple post ids. Returns Map postId -> count. */
export const countByPostIds = async (postIds) => {
  if (postIds.length === 0) return new Map();
  const query = `
    SELECT ${FIELDS.postId}, COUNT(*)::int AS count
    FROM ${TABLE_NAME}
    WHERE ${FIELDS.postId} = ANY($1::int[])
    GROUP BY ${FIELDS.postId}
  `;
  const result = await pool.query(query, [postIds]);
  const map = new Map();
  result.rows.forEach((row) => map.set(Number(row.post_id), Number(row.count)));
  return map;
};

/** Get post ids that user has liked (from a given list). */
export const getLikedPostIdsByUser = async (postIds, userId) => {
  if (postIds.length === 0 || !userId) return new Set();
  const query = `
    SELECT ${FIELDS.postId}
    FROM ${TABLE_NAME}
    WHERE ${FIELDS.postId} = ANY($1::int[]) AND ${FIELDS.userId} = $2
  `;
  const result = await pool.query(query, [postIds, userId]);
  return new Set(result.rows.map((r) => Number(r.post_id)));
};
