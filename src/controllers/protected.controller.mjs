export const getProtectedRoute = (req, res) => {
  return res.json({
    message: "This is protected content",
    user: req.user,
  });
};

export const getAdminOnlyRoute = (req, res) => {
  return res.json({
    message: "This is admin-only content",
    admin: req.user,
  });
};

