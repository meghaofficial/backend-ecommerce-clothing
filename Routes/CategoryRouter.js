const express = require("express");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteAllCategoriesAndProducts,
  getCategoryById,
} = require("../Controllers/CategoryController");
const { isAuthenticated, isAuthorized } = require("../Middlewares/Auth");
const router = express.Router();

router
  .route("/categories")
  .get(getAllCategories)
  .post(isAuthenticated, isAuthorized, createCategory)
  .put(isAuthenticated, isAuthorized, updateCategory)
  .delete(isAuthenticated, isAuthorized, deleteCategory);

router
  .route("/categories/:id").get(getCategoryById);

router.delete("/delete-all-categories", deleteAllCategoriesAndProducts);

module.exports = router