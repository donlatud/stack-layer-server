import {
  getRecentCommentsForNotifications,
  getRecentLikesForNotifications,
  getRecentPublishedPostsForNotifications,
} from "../repositories/notifications.repository.mjs";

/** Normalize timestamp for display */
const formatTimestamp = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** Get combined notifications: comments, likes, published */
export const getNotificationsService = async (limit = 20) => {
  const [comments, likes, publishedPosts] = await Promise.all([
    getRecentCommentsForNotifications(limit),
    getRecentLikesForNotifications(limit),
    getRecentPublishedPostsForNotifications(limit),
  ]);

  const items = [];

  comments.forEach((c) => {
    items.push({
      id: `comment-${c.id}`,
      type: "comment",
      userName: c.user_name,
      userAvatar: c.user_profile_pic,
      action: "Commented on",
      articleTitle: c.post_title,
      postId: c.post_id,
      comment: c.comment_text,
      createdAt: c.created_at,
      timestampLabel: formatTimestamp(c.created_at),
    });
  });

  likes.forEach((l) => {
    items.push({
      id: `like-${l.id}`,
      type: "like",
      userName: l.user_name,
      userAvatar: l.user_profile_pic,
      action: "Liked your article",
      articleTitle: l.post_title,
      postId: l.post_id,
      createdAt: l.liked_at,
      timestampLabel: formatTimestamp(l.liked_at),
    });
  });

  publishedPosts.forEach((p) => {
    items.push({
      id: `published-${p.id}`,
      type: "published",
      userName: "Admin",
      userAvatar: null,
      action: "Published new article.",
      articleTitle: p.title,
      postId: p.id,
      createdAt: null,
      timestampLabel: "Recently",
    });
  });

  items.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return items.slice(0, limit);
};
