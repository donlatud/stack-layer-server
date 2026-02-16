import {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/categories.service.mjs";
import { CATEGORY_MESSAGES } from "../constants/messages.mjs";

export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();
    return res.status(200).json({
      data: categories,
    });
  } catch (err) {
    console.error("getAllCategoriesController", err);
    return res.status(500).json({
      message: CATEGORY_MESSAGES.READ_LIST_ERROR,
    });
  }
};

export const getCategoryByIdController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await getCategoryByIdService(categoryId);
    if (!category) {
      return res.status(404).json({
        message: CATEGORY_MESSAGES.NOT_FOUND,
      });
    }
    return res.status(200).json({
      data: category,
    });
  } catch (err) {
    console.error("getCategoryByIdController", err);
    return res.status(500).json({
      message: CATEGORY_MESSAGES.READ_ONE_ERROR,
    });
  }
};

export const createCategoryController = async (req, res) => {
  try {
    const body = req.body;
    const category = await createCategoryService(body);
    return res.status(201).json({
      message: "Created category successfully",
      data: category,
    });
  } catch (err) {
    console.error("createCategoryController", err);
    return res.status(500).json({
      message: CATEGORY_MESSAGES.CREATE_ERROR,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const body = req.body;
    const category = await updateCategoryService(categoryId, body);
    if (!category) {
      return res.status(404).json({
        message: CATEGORY_MESSAGES.NOT_FOUND,
      });
    }
    return res.status(200).json({
      message: "Updated category successfully",
      data: category,
    });
  } catch (err) {
    console.error("updateCategoryController", err);
    return res.status(500).json({
      message: CATEGORY_MESSAGES.UPDATE_ERROR,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await deleteCategoryService(categoryId);
    if (!category) {
      return res.status(404).json({
        message: CATEGORY_MESSAGES.NOT_FOUND,
      });
    }
    return res.status(200).json({
      message: "Deleted category successfully",
      data: category,
    });
  } catch (err) {
    console.error("deleteCategoryController", err);
    return res.status(500).json({
      message: CATEGORY_MESSAGES.DELETE_ERROR,
    });
  }
};
