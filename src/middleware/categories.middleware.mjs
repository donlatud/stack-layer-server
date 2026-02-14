import { getCategoryById } from "../repositories/categories.repository.mjs";

const isProvided = (value) => value !== undefined && value !== null;

const validationError = (res, detail) =>
  res.status(400).json({
    message:
      "Server could not create or update category because there are missing or invalid data from client",
    detail,
  });

/** Validate body for create/update: name required, string */
export const categoryBodyValidation = (req, res, next) => {
  const { name } = req.body;

  if (!isProvided(name)) {
    return validationError(res, "Name is required");
  }
  if (typeof name !== "string") {
    return validationError(res, "Name must be a string");
  }
  if (name.trim() === "") {
    return validationError(res, "Name must not be empty");
  }

  next();
};

/** Ensure category exists for GET/PUT/DELETE by id */
export const categoryIdValidation = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Server could not find the requested category",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Server could not validate category because of database connection",
    });
  }
};
