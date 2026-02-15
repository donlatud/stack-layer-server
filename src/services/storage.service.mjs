import supabase from "../utils/supabase.mjs";

const BUCKET_POSTS = "personal-blog";
const FOLDER_POSTS = "posts";
const FOLDER_AVATARS = "avatars";

/**
 * อัปโหลดรูป thumbnail โพสต์ไป Supabase Storage
 * @param {Buffer} buffer - ข้อมูลไฟล์
 * @param {string} originalName - ชื่อไฟล์เดิม
 * @param {string} mimeType - MIME type
 * @returns {Promise<{ publicUrl: string }>} public URL ของไฟล์
 */
export const uploadPostImage = async (buffer, originalName, mimeType) => {
  const filePath = `${FOLDER_POSTS}/${Date.now()}_${originalName}`;
  const { data, error } = await supabase.storage
    .from(BUCKET_POSTS)
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(BUCKET_POSTS)
    .getPublicUrl(data.path);

  return { publicUrl: urlData.publicUrl };
};

/**
 * อัปโหลดรูปโปรไฟล์ไป Supabase Storage (bucket เดียวกับโพสต์ โฟลเดอร์ avatars/)
 * @param {Buffer} buffer - ข้อมูลไฟล์
 * @param {string} originalName - ชื่อไฟล์เดิม
 * @param {string} mimeType - MIME type
 * @param {string} userId - id ผู้ใช้ (ใส่ใน path ให้ไม่ชน)
 * @returns {Promise<{ publicUrl: string }>} public URL ของไฟล์
 */
export const uploadAvatar = async (buffer, originalName, mimeType, userId) => {
  const filePath = `${FOLDER_AVATARS}/${userId}_${Date.now()}_${originalName}`;
  const { data, error } = await supabase.storage
    .from(BUCKET_POSTS)
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(BUCKET_POSTS)
    .getPublicUrl(data.path);

  return { publicUrl: urlData.publicUrl };
};
