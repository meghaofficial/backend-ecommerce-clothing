const CategoryModel = require("../Models/Category.js");
const ProductModel = require("../Models/Product.js");

const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    return res.status(200).json({
      success: true,
      message: "All Categories",
      data: categories,
      size: categories.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not exist",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All Categories",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { categoryId, categoryName } = req.body;
    if (!categoryId || !categoryName) {
      return res.status(404).json({
        success: false,
        message: "Both the fields are required",
      });
    }
    const newCategory = new CategoryModel({ categoryId, categoryName });
    await newCategory.save();
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Bad Request",
      error: error.message || error,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id, updatedId, updatedName } = req.body;
    const existCategory = await CategoryModel.findById({ _id: id });

    if (!existCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (updatedId) existCategory.categoryId = updatedId;
    if (updatedName) existCategory.categoryName = updatedName;
    await existCategory.save();

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: existCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;
    const existCategory = await CategoryModel.findById(id);

    if (!existCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // check the related products
    await ProductModel.deleteMany({ categoryId: id });
    await CategoryModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Bad Request",
      error,
    });
  }
};

const deleteAllCategoriesAndProducts = async (req, res) => {
  try {
    await CategoryModel.deleteMany({});
    await ProductModel.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "Categories And Products Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteAllCategoriesAndProducts,
};
