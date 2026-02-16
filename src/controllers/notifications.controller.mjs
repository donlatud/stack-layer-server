import { getNotificationsService } from "../services/notifications.service.mjs";
import { findById } from "../repositories/users.repository.mjs";

/** GET /notifications - admin: comments, likes, published; user: published only */
export const getNotificationsController = async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const profile = await findById(req.user?.id);
    const role = profile?.role === "admin" ? "admin" : "user";
    const items = await getNotificationsService(limit, role);
    return res.status(200).json({ data: items });
  } catch (err) {
    console.error("getNotificationsController error:", err);
    return res.status(500).json({ message: "Server could not load notifications" });
  }
};
