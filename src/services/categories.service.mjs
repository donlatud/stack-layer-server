import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../repositories/categories.repository.mjs";

export const getAllCategoriesService = async () => {
  try {
    const categories = await getAllCategories();
    return categories;
  } catch (error) {
    throw error;
  }
};

export const getCategoryByIdService = async (categoryId) => {
  try {
    const category = await getCategoryById(categoryId);
    return category;
  } catch (error) {
    throw error;
  }
};

export const createCategoryService = async (body) => {
  try {
    const category = await createCategory(body);
    return category;
  } catch (error) {
    throw error;
  }
};

export const updateCategoryService = async (categoryId, body) => {
  try {
    const category = await updateCategory(categoryId, body);
    return category;
  } catch (error) {
    throw error;
  }
};

export const deleteCategoryService = async (categoryId) => {
  try {
    const category = await deleteCategory(categoryId);
    return category;
  } catch (error) {
    throw error;
  }
};
