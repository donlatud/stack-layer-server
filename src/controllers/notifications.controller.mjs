import { getNotificationsService } from "../services/notifications.service.mjs";

/** GET /notifications - returns comments, likes, published (for member + admin) */
export const getNotificationsController = async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const items = await getNotificationsService(limit);
    return res.status(200).json({ data: items });
  } catch (err) {
    console.error("getNotificationsController error:", err);
    return res.status(500).json({ message: "Server could not load notifications" });
  }
};
