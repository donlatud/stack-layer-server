/** ข้อความ response ของ API ใช้ร่วมกันใน controller / middleware */

export const POST_MESSAGES = {
  NOT_FOUND: "Server could not find a requested post",
  VALIDATE_ID_ERROR: "Server could not validate the post id",
  READ_ERROR: "Server could not read post because database connection",
  CREATE_ERROR: "Server could not create post because database connection",
  UPDATE_ERROR: "Server could not update post because database connection",
  DELETE_ERROR: "Server could not delete post because database connection",
  UPLOAD_IMAGE_ERROR: "Server could not upload image",
  CREATED: "Created post successfully",
  UPDATED: "Updated post successfully",
  DELETED: "Deleted post successfully",
};

export const POST_VALIDATION_MESSAGE =
  "Server could not create or update post because there are missing data from client";

export const CATEGORY_MESSAGES = {
  NOT_FOUND: "Server could not find the requested category",
  READ_LIST_ERROR: "Server could not read categories because of database connection",
  READ_ONE_ERROR: "Server could not read category because of database connection",
  CREATE_ERROR: "Server could not create category because of database connection",
  UPDATE_ERROR: "Server could not update category because of database connection",
  DELETE_ERROR: "Server could not delete category because of database connection",
};
