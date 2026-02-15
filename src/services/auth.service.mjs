import supabase from "../utils/supabase.mjs";
import * as usersRepository from "../repositories/users.repository.mjs";
import { uploadAvatar } from "./storage.service.mjs";

// Register: check username → Supabase signUp → insert into users table
export const register = async (body) => {
  const { email, password, username, name } = body;

  const existing = await usersRepository.findByUsername(username);
  if (existing) {
    return {
      ok: false,
      code: "USERNAME_TAKEN",
      message: "This username is already taken",
    };
  }

  const { data, error: supabaseError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (supabaseError) {
    if (supabaseError.code === "user_already_exists") {
      return {
        ok: false,
        code: "EMAIL_EXISTS",
        message: "User with this email already exists",
      };
    }
    return {
      ok: false,
      code: "SIGNUP_FAILED",
      message: "Failed to create user. Please try again.",
    };
  }

  const supabaseUserId = data.user.id;
  const user = await usersRepository.create({
    id: supabaseUserId,
    username,
    name,
    role: "user",
  });

  return { ok: true, user };
};

// Login: Supabase signInWithPassword
export const login = async (body) => {
  const { email, password } = body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (
      error.code === "invalid_credentials" ||
      error.message?.includes("Invalid login credentials")
    ) {
      return {
        ok: false,
        code: "INVALID_CREDENTIALS",
        message: "Your password is incorrect or this email doesn't exist",
      };
    }
    return { ok: false, code: "LOGIN_FAILED", message: error.message };
  }

  return { ok: true, access_token: data.session.access_token };
};

// Get current user from Bearer token: verify with Supabase, then load profile from users table
export const getUserByToken = async (token) => {
  if (!token) {
    return {
      ok: false,
      code: "TOKEN_MISSING",
      message: "Unauthorized: Token missing",
    };
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    return {
      ok: false,
      code: "UNAUTHORIZED",
      message: "Unauthorized or token expired",
    };
  }

  const profile = await usersRepository.findById(data.user.id);
  if (!profile) {
    return {
      ok: false,
      code: "USER_NOT_FOUND",
      message: "User profile not found",
    };
  }

  return {
    ok: true,
    user: {
      id: data.user.id,
      email: data.user.email,
      username: profile.username,
      name: profile.name,
      role: profile.role,
      profilePic: profile.profile_pic,
    },
  };
};

// Reset password: verify token → verify old password → update to new password
export const resetPassword = async ({ token, oldPassword, newPassword }) => {
  if (!token) {
    return {
      ok: false,
      code: "TOKEN_MISSING",
      message: "Unauthorized: Token missing",
    };
  }

  const { data: userData, error: getUserError } = await supabase.auth.getUser(token);
  if (getUserError || !userData?.user) {
    return {
      ok: false,
      code: "UNAUTHORIZED",
      message: "Unauthorized or token expired",
    };
  }

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: oldPassword,
  });
  if (loginError) {
    return {
      ok: false,
      code: "INVALID_OLD_PASSWORD",
      message: "Invalid old password",
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (updateError) {
    return {
      ok: false,
      code: "UPDATE_FAILED",
      message: updateError.message,
    };
  }

  return { ok: true };
};

/**
 * อัปเดตโปรไฟล์: อัปโหลดรูป (ถ้ามี) ไป Storage แล้วอัปเดต users.profile_pic และ/หรือ name
 * @param {string} userId - id ผู้ใช้ (จาก req.user.id)
 * @param {{ file?: { buffer: Buffer, originalname: string, mimetype: string }, name?: string }} payload
 * @returns {{ ok: boolean, code?: string, message?: string, user?: object }}
 */
export const updateProfile = async (userId, payload) => {
  const { file, name } = payload;
  const updates = {};
  if (name !== undefined && typeof name === "string") {
    updates.name = name.trim();
  }
  if (file && file.buffer && Buffer.isBuffer(file.buffer)) {
    const { publicUrl } = await uploadAvatar(
      file.buffer,
      file.originalname,
      file.mimetype,
      userId
    );
    updates.profile_pic = publicUrl;
  }
  if (Object.keys(updates).length === 0) {
    const profile = await usersRepository.findById(userId);
    if (!profile) {
      return { ok: false, code: "USER_NOT_FOUND", message: "User profile not found" };
    }
    return {
      ok: true,
      user: {
        id: profile.id,
        email: null,
        username: profile.username,
        name: profile.name,
        role: profile.role,
        profilePic: profile.profile_pic,
      },
    };
  }
  const updated = await usersRepository.updateProfile(userId, updates);
  if (!updated) {
    return { ok: false, code: "USER_NOT_FOUND", message: "User profile not found" };
  }
  return {
    ok: true,
    user: {
      id: updated.id,
      email: null,
      username: updated.username,
      name: updated.name,
      role: updated.role,
      profilePic: updated.profile_pic,
    },
  };
};
