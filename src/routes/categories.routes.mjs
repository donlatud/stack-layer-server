import express from "express";
import {
  getAllCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categories.controller.mjs";
import {
  categoryBodyValidation,
  categoryIdValidation,
} from "../middleware/categories.middleware.mjs";

const router = express.Router();

router.get("/", getAllCategoriesController);
router.get("/:categoryId", categoryIdValidation, getCategoryByIdController);
router.post("/", categoryBodyValidation, createCategoryController);
router.put("/:categoryId", categoryIdValidation, categoryBodyValidation, updateCategoryController);
router.delete("/:categoryId", categoryIdValidation, deleteCategoryController);

export default router;
