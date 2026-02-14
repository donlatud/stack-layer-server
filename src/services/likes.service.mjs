import {
  addLike as addLikeRepo,
  removeLike as removeLikeRepo,
  countByPostId,
  hasUserLiked,
  countByPostIds,
  getLikedPostIdsByUser,
} from "../repositories/likes.repository.mjs";

/** Add like (idempotent: no-op if already liked). */
export const addLikeService = async (postId, userId) => {
  const already = await hasUserLiked(postId, userId);
  if (already) return { liked: true };
  await addLikeRepo(postId, userId);
  return { liked: true };
};

/** Remove like. */
export const removeLikeService = async (postId, userId) => {
  await removeLikeRepo(postId, userId);
  return { liked: false };
};

/** Get like count and is_liked for one post. */
export const getLikeInfoService = async (postId, userId = null) => {
  const [count, isLiked] = await Promise.all([
    countByPostId(postId),
    userId ? hasUserLiked(postId, userId) : Promise.resolve(false),
  ]);
  return { likes_count: count, is_liked: isLiked };
};

/** Get like counts and liked set for many posts (for list). */
export const getLikesForPostsService = async (postIds, userId = null) => {
  const [countMap, likedSet] = await Promise.all([
    countByPostIds(postIds),
    userId ? getLikedPostIdsByUser(postIds, userId) : Promise.resolve(new Set()),
  ]);
  return { countMap, likedSet };
};
