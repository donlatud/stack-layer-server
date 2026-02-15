import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

/** รับฟิลด์ imageFile ได้ 1 ไฟล์ (ใช้กับ POST สร้างโพสต์) */
export const postImageUpload = upload.fields([
  { name: "imageFile", maxCount: 1 },
]);

/** รับฟิลด์ avatarFile ได้ 1 ไฟล์ (ใช้กับ PATCH อัปเดตโปรไฟล์) */
export const avatarUpload = upload.fields([
  { name: "avatarFile", maxCount: 1 },
]);
