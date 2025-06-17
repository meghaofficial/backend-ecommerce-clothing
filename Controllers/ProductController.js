const CategoryModel = require("../Models/Category");
const ProductModel = require("../Models/Product");
const cloudinary = require("../utils/cloudinary");
const { extractPublicId } = require("../utils/extractPublicId");

const getAllTags = async (req, res) => {
  const allTags = ProductModel.schema.obj.tag.enum;
  return res.status(200).json({
    success: true,
    allTags,
  });
};

const getAllSizes = async (req, res) => {
  const sizes = ProductModel.schema.obj.size.enum;
  return res.status(200).json({
    success: true,
    sizes,
  });
};

const createProduct = async (req, res) => {
  try {
    const {
      categoryId,
      title,
      description,
      original_price,
      discount_percent,
      sell_no,
      stock,
      tag,
      unique_code,
      size,
      color,
    } = req.body;

    const existingProduct = await ProductModel.findOne({ unique_code });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }

    const mainImage = req.files["imgSrc"]?.[0];
    const subImages = req.files["sub_images"];

    const existcategory = await CategoryModel.findById(categoryId).populate();
    if (!existcategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (
      !title ||
      !description ||
      !original_price ||
      !stock ||
      !tag ||
      !unique_code ||
      size.length <= 0 ||
      color.length <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, price, stock, tag, unique code, size & color is required",
      });
    }

    const allowedTags = await ProductModel.schema.obj.tag.enum;

    if (!allowedTags.includes(tag)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tag",
      });
    }

    const mainImageUrl = (
      await cloudinary.uploader.upload(mainImage.path, { folder: "products" })
    ).secure_url;

    const subImageUrls = await Promise.all(
      subImages.map(async (image) => {
        const uploadResult = await cloudinary.uploader.upload(image.path, {
          folder: "products",
        });
        return uploadResult.secure_url;
      })
    );

    const newProduct = new ProductModel({
      categoryId: existcategory._id,
      imgSrc: mainImageUrl,
      sub_images: subImageUrls,
      categoryName: existcategory.categoryName,
      title,
      description,
      original_price,
      sell_no,
      discount_percent,
      stock,
      tag,
      unique_code,
      discounted_price: discount_percent
        ? original_price - (discount_percent / 100) * original_price
        : 0,
      size,
      color,
    });

    await newProduct.save();

    existcategory.noOfProducts = existcategory.noOfProducts + 1;
    await existcategory.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { tag } = req.query;

    let filter = {};
    if (tag) {
      filter.tag = tag; // Assumes 'tags' is the field name in your product model
    }

    const products = await ProductModel.find(filter);

    return res.status(200).json({
      success: true,
      message: tag ? `Products with tag "${tag}"` : "All Products",
      data: products,
      size: products.length,
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

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById({ _id: id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product is present",
      product,
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

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const existCategory = await CategoryModel.findById({ _id: categoryId });
    if (!existCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not exist",
      });
    }

    const relatedProducts = await ProductModel.find({ categoryId });

    return res.status(200).json({
      success: true,
      message: "All Products",
      data: relatedProducts,
      size: relatedProducts.length,
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

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById({ _id: id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!req.body) {
      if (req.files?.imgSrc?.length <= 0) {
        return res.status(404).json({
          success: false,
          message: "Update atleast 1 field",
        });
      }
    }

    let updatedImgSrc;
    const newImgSrc = req.files?.imgSrc?.[0];

    if (newImgSrc) {
      const oldImagePublicId = extractPublicId(product.imgSrc);
      if (oldImagePublicId) {
        await cloudinary.uploader.destroy(oldImagePublicId);
      }

      updatedImgSrc = (
        await cloudinary.uploader.upload(newImgSrc.path, { folder: "products" })
      ).secure_url;
    }

    const subImagesUrl = [...product?.sub_images];
    const subImagesSrc = req.files?.sub_images;

    if (subImagesSrc?.[0]) {
      const oldSubImagePublicId = extractPublicId(
        product?.sub_images?.[0]?.imgSrc
      );
      if (oldSubImagePublicId) {
        await cloudinary.uploader.destroy(oldSubImagePublicId);
      }
      subImagesUrl[0] = (
        await cloudinary.uploader.upload(subImagesSrc?.[0]?.path, {
          folder: "products",
        })
      ).secure_url;
    }
    if (subImagesSrc?.[1]) {
      const oldSubImagePublicId = extractPublicId(
        product?.sub_images?.[1]?.imgSrc
      );
      if (oldSubImagePublicId) {
        await cloudinary.uploader.destroy(oldSubImagePublicId);
      }
      subImagesUrl[1] = (
        await cloudinary.uploader.upload(subImagesSrc?.[1]?.path, {
          folder: "products",
        })
      ).secure_url;
    }
    if (subImagesSrc?.[2]) {
      const oldSubImagePublicId = extractPublicId(
        product?.sub_images?.[2]?.imgSrc
      );
      if (oldSubImagePublicId) {
        await cloudinary.uploader.destroy(oldSubImagePublicId);
      }
      subImagesUrl[2] = (
        await cloudinary.uploader.upload(subImagesSrc?.[2]?.path, {
          folder: "products",
        })
      ).secure_url;
    }
    if (subImagesSrc?.[3]) {
      const oldSubImagePublicId = extractPublicId(
        product?.sub_images?.[3]?.imgSrc
      );
      if (oldSubImagePublicId) {
        await cloudinary.uploader.destroy(oldSubImagePublicId);
      }
      subImagesUrl[3] = (
        await cloudinary.uploader.upload(subImagesSrc?.[3]?.path, {
          folder: "products",
        })
      ).secure_url;
    }

    let updatedDiscountPrice;
    if (req.body?.discount_percent) {
      const percent = req.body?.discount_percent;
      const originalPrice = req.body?.original_price || product?.original_price;
      updatedDiscountPrice = originalPrice - (percent / 100) * originalPrice;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        categoryId: req.body?.categoryId && req.body?.categoryId,
        imgSrc: updatedImgSrc,
        sub_images: subImagesUrl,
        title: req.body?.title && req.body?.title,
        description: req.body?.description && req.body?.description,
        original_price: req.body?.original_price && req.body?.original_price,
        discount_percent:
          req.body?.discount_percent && req.body?.discount_percent,
        sell_no: req.body?.sell_no && req.body?.sell_no,
        stock: req.body?.stock && req.body?.stock,
        discounted_price: updatedDiscountPrice,
        size: req.body?.size && req.body?.size,
        color: req.body?.color && req.body?.color,
        tag: req.body?.tag && req.body?.tag,
        unique_code: req.body?.unique_code && req.body?.unique_code,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "All Products",
      updatedProduct,
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

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById({ _id: id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const category = await CategoryModel.findById(product?.categoryId);

    await ProductModel.findByIdAndDelete({ _id: id });

    const updatedCount = Math.max(0, category.noOfProducts - 1);
    await CategoryModel.findByIdAndUpdate(category._id, {
      noOfProducts: updatedCount,
    });

    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
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

const deleteAllProducts = async (req, res) => {
  try {
    await ProductModel.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "Products Deleted Successfully",
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

const getProductByTag = async (req, res) => {
  try {
    const { tag } = req.query;
    if (!tag) {
      return res.status(200).json({
        success: false,
        message: "No tag available",
      });
    } else {
      const products = await ProductModel.find({ tag });
      return res.status(200).json({
        success: true,
        message: "All tags related Products",
        allProducts: products,
        size: products.length,
      });
    }
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
  getAllTags,
  getAllSizes,
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  getProductByTag,
};
