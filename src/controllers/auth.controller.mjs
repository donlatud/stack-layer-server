import * as authService from "../services/auth.service.mjs";

const BAD_REQUEST_CODES = [
  "USERNAME_TAKEN",
  "EMAIL_EXISTS",
  "SIGNUP_FAILED",
  "INVALID_CREDENTIALS",
  "LOGIN_FAILED",
  "INVALID_OLD_PASSWORD",
  "UPDATE_FAILED",
];
const UNAUTHORIZED_CODES = ["TOKEN_MISSING", "UNAUTHORIZED", "USER_NOT_FOUND"];

export const registerController = async (req, res) => {
  const { email, password, username, name } = req.body;
  const result = await authService.register({ email, password, username, name });

  if (!result.ok) {
    if (BAD_REQUEST_CODES.includes(result.code)) {
      return res.status(400).json({ error: result.message });
    }
    return res.status(500).json({ error: "An error occurred during registration" });
  }

  return res.status(201).json({
    message: "User created successfully",
    user: result.user,
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  if (!result.ok) {
    if (BAD_REQUEST_CODES.includes(result.code)) {
      return res.status(400).json({ error: result.message });
    }
    return res.status(500).json({ error: "An error occurred during login" });
  }

  return res.status(200).json({
    message: "Signed in successfully",
    access_token: result.access_token,
  });
};

export const getCurrentUserController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const result = await authService.getUserByToken(token);

  if (!result.ok) {
    if (UNAUTHORIZED_CODES.includes(result.code)) {
      return res.status(401).json({ error: result.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }

  return res.status(200).json(result.user);
};

export const resetPasswordController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { oldPassword, newPassword } = req.body;
  const result = await authService.resetPassword({
    token,
    oldPassword,
    newPassword,
  });

  if (!result.ok) {
    if (UNAUTHORIZED_CODES.includes(result.code)) {
      return res.status(401).json({ error: result.message });
    }
    if (BAD_REQUEST_CODES.includes(result.code)) {
      return res.status(400).json({ error: result.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }

  return res.status(200).json({ message: "Password updated successfully" });
};
