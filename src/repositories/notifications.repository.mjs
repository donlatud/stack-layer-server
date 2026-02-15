import pool from "../utils/db.mjs";
import { TABLE_NAME as COMMENTS_TABLE, FIELDS as COMMENT_FIELDS } from "../models/comments.model.mjs";
import { TABLE_NAME as LIKES_TABLE, FIELDS as LIKE_FIELDS } from "../models/likes.model.mjs";
import { TABLE_NAME as POSTS_TABLE, FIELDS as POST_FIELDS } from "../models/posts.model.mjs";
import { TABLE_NAME as USERS_TABLE, FIELDS as USER_FIELDS } from "../models/users.model.mjs";

/** Recent comments with commenter and post info, for notifications */
export const getRecentCommentsForNotifications = async (limit = 20) => {
  const query = `
    SELECT c.${COMMENT_FIELDS.id}, c.${COMMENT_FIELDS.postId}, c.${COMMENT_FIELDS.commentText},
           c.${COMMENT_FIELDS.createdAt},
           u.${USER_FIELDS.name} AS user_name,
           u.${USER_FIELDS.profilePic} AS user_profile_pic,
           p.${POST_FIELDS.title} AS post_title
    FROM ${COMMENTS_TABLE} c
    INNER JOIN ${USERS_TABLE} u ON u.${USER_FIELDS.id} = c.${COMMENT_FIELDS.userId}
    INNER JOIN ${POSTS_TABLE} p ON p.${POST_FIELDS.id} = c.${COMMENT_FIELDS.postId}
    ORDER BY c.${COMMENT_FIELDS.createdAt} DESC
    LIMIT $1
  `;
  const result = await pool.query(query, [limit]);
  return result.rows;
};

/** Recent likes with liker and post info, for notifications */
export const getRecentLikesForNotifications = async (limit = 20) => {
  const query = `
    SELECT l.${LIKE_FIELDS.id}, l.${LIKE_FIELDS.postId}, l.${LIKE_FIELDS.likedAt},
           u.${USER_FIELDS.name} AS user_name,
           u.${USER_FIELDS.profilePic} AS user_profile_pic,
           p.${POST_FIELDS.title} AS post_title
    FROM ${LIKES_TABLE} l
    INNER JOIN ${USERS_TABLE} u ON u.${USER_FIELDS.id} = l.${LIKE_FIELDS.userId}
    INNER JOIN ${POSTS_TABLE} p ON p.${POST_FIELDS.id} = l.${LIKE_FIELDS.postId}
    ORDER BY l.${LIKE_FIELDS.likedAt} DESC
    LIMIT $1
  `;
  const result = await pool.query(query, [limit]);
  return result.rows;
};

/** Recent published posts (status_id=1), for notifications */
export const getRecentPublishedPostsForNotifications = async (limit = 10) => {
  const query = `
    SELECT p.${POST_FIELDS.id}, p.${POST_FIELDS.title}
    FROM ${POSTS_TABLE} p
    WHERE p.${POST_FIELDS.statusId} = 1
    ORDER BY p.${POST_FIELDS.id} DESC
    LIMIT $1
  `;
  const result = await pool.query(query, [limit]);
  return result.rows;
};
