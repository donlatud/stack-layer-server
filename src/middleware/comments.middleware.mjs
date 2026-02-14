const isProvided = (value) => value !== undefined && value !== null;

const validationError = (res, detail) =>
  res.status(400).json({
    message:
      "Server could not create comment because there are missing or invalid data from client",
    detail,
  });

/** Validate body for POST comment: comment_text required, non-empty string */
export const commentBodyValidation = (req, res, next) => {
  const commentText = req.body?.comment_text;
  if (!isProvided(commentText)) {
    return validationError(res, "comment_text is required");
  }
  if (typeof commentText !== "string") {
    return validationError(res, "comment_text must be a string");
  }
  if (commentText.trim() === "") {
    return validationError(res, "comment_text must not be empty");
  }
  next();
};
