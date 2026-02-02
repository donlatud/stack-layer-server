import { createPostService } from "../services/posts.service.mjs";

export async function createPostController(req, res) {
  try {
    const body = req.body;
    await createPostService(body);
    res.status(201).json({ message: "Created post sucessfully" });
  } catch (err) {
    const statusCode = err.statusCode ?? 500;
    const message =
      statusCode === 400
        ? "Server could not create post because there are missing data from client"
        : "Server could not create post because database connection";
    res.status(statusCode).json({ message });
  }
}
