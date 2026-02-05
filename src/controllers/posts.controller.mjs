import {
  createPostService,
  getPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} from "../services/posts.service.mjs";


export const createPostController = async (req, res) => {
  try {
    const body = req.body;
    await createPostService(body);
    return res.status(201).json(
      {
        "message": "Created post sucessfully"
      }
    );
  } catch {
    return res.status(500).json(
      {
        "message": "Server could not create post because database connection"
      }
    );
  }
}

export const getPostByIdController = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await getPostByIdService(postId);
    return res.status(200).json(
      {
        "data": post
      }
    );
  } catch {
    return res.status(500).json(
      {
        "message": "Server could not read post because database connection"
      }
    );
  }
};

export const updatePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const body = req.body;
    await updatePostService(postId, body);
    return res.status(200).json(
      {
        "message": "Updated post sucessfully"
      }
    );
  } catch {
    return res.status(500).json(
      {
        "message": "Server could not update post because database connection"
      }
    );
  }
};

export const deletePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    await deletePostService(postId);
    return res.status(200).json(
      {
        "message": "Deleted post sucessfully"
      }
    );
  } catch {
    return res.status(500).json(
      {
        "message": "Server could not delete post because database connection"
      }
    );
  }
};

export const getPostsController = async (req, res) => {
  try {
    const { page, limit, category, keyword } = req.query;
    const data = await getPostsService({ page, limit, category, keyword });
    return res.status(200).json(
      {
        "data": data
      }
    );
  } catch {
    return res.status(500).json(
      {
        "message": "Server could not read post because database connection"
      }
    );
  }
};
