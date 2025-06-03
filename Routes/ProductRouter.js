const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  deleteAllProducts,
  getAllTags,
  getAllSizes,
} = require("../Controllers/ProductController");
const { isAuthenticated, isAuthorized } = require("../Middlewares/Auth");
const upload = require("../Middlewares/multer2");
const router = express.Router();

router.post(
  "/create-product",
  isAuthenticated,
  isAuthorized,
  upload.fields([
    { name: "imgSrc", maxCount: 1 },
    { name: "sub_images", maxCount: 4 },
  ]),
  createProduct
);
router.get("/all-products", getAllProducts);
router.get("/all-products/:categoryId", getProductsByCategory);

router
  .route("/product/:id")
  .get(getProductById)
  .put(isAuthenticated, isAuthorized, upload.fields([
    { name: "imgSrc", maxCount: 1 },
    { name: "sub_images", maxCount: 4 },
  ]), updateProduct)
  .delete(isAuthenticated, isAuthorized, deleteProduct);

router.delete("/delete-all-products", deleteAllProducts);

router.get("/all-tags", isAuthenticated, isAuthorized, getAllTags);
router.get("/sizes", isAuthenticated, isAuthorized, getAllSizes);

module.exports = router;
