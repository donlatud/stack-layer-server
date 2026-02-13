const has = (obj, key) => obj[key] !== undefined && obj[key] !== null && String(obj[key]).trim() !== "";

export const registerBodyValidation = (req, res, next) => {
  const { email, password, username, name } = req.body;
  if (!has(req.body, "email")) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!has(req.body, "password")) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (!has(req.body, "username")) {
    return res.status(400).json({ error: "Username is required" });
  }
  if (!has(req.body, "name")) {
    return res.status(400).json({ error: "Name is required" });
  }
  next();
};

export const loginBodyValidation = (req, res, next) => {
  if (!has(req.body, "email")) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!has(req.body, "password")) {
    return res.status(400).json({ error: "Password is required" });
  }
  next();
};

export const resetPasswordBodyValidation = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  if (!has(req.body, "oldPassword")) {
    return res.status(400).json({ error: "Old password is required" });
  }
  if (!has(req.body, "newPassword")) {
    return res.status(400).json({ error: "New password is required" });
  }
  next();
};
