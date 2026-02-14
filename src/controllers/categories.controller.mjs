import {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/categories.service.mjs";

export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();
    return res.status(200).json({
      data: categories,
    });
  } catch {
    return res.status(500).json({
      message: "Server could not read categories because of database connection",
    });
  }
};

export const getCategoryByIdController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await getCategoryByIdService(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Server could not find the requested category",
      });
    }
    return res.status(200).json({
      data: category,
    });
  } catch {
    return res.status(500).json({
      message: "Server could not read category because of database connection",
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
  } catch {
    return res.status(500).json({
      message: "Server could not create category because of database connection",
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
        message: "Server could not find the requested category",
      });
    }
    return res.status(200).json({
      message: "Updated category successfully",
      data: category,
    });
  } catch {
    return res.status(500).json({
      message: "Server could not update category because of database connection",
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await deleteCategoryService(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Server could not find the requested category",
      });
    }
    return res.status(200).json({
      message: "Deleted category successfully",
      data: category,
    });
  } catch {
    return res.status(500).json({
      message: "Server could not delete category because of database connection",
    });
  }
};
