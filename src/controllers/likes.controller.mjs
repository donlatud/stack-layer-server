import {
  addLikeService,
  removeLikeService,
  getLikeInfoService,
} from "../services/likes.service.mjs";

/** POST /posts/:postId/like — require auth, add like. */
export const postLikeController = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const postIdNum = parseInt(postId, 10);
    if (Number.isNaN(postIdNum)) {
      return res.status(400).json({ message: "Invalid post id" });
    }
    await addLikeService(postIdNum, userId);
    const info = await getLikeInfoService(postIdNum, userId);
    return res.status(200).json({
      message: "Liked",
      data: info,
    });
  } catch (err) {
    console.error("postLikeController", err);
    return res.status(500).json({
      message: "Server could not add like",
    });
  }
};

/** DELETE /posts/:postId/like — require auth, remove like. */
export const deleteLikeController = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const postIdNum = parseInt(postId, 10);
    if (Number.isNaN(postIdNum)) {
      return res.status(400).json({ message: "Invalid post id" });
    }
    await removeLikeService(postIdNum, userId);
    const info = await getLikeInfoService(postIdNum, userId);
    return res.status(200).json({
      message: "Unliked",
      data: info,
    });
  } catch (err) {
    console.error("deleteLikeController", err);
    return res.status(500).json({
      message: "Server could not remove like",
    });
  }
};
