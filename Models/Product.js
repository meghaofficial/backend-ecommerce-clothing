const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    imgSrc: {
      type: String,
      required: true,
    },
    sub_images: {
      type: [String],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      default: [],
      required: true,
    },
    color: {
      type: [String],
      default: [],
      required: true,
    },
    original_price: {
      type: String,
      required: true,
      trim: true,
    },
    discount_percent: {
      type: Number,
      default: 0,
    },
    sell_no: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
    },
    tag: {
      type: String,
      required: true,
      default: "new_arrival",
      enum: ["new_arrival", "top_deals", "hero_img", "coming_soon", "no_tag"],
      required: true,
    },
    unique_code: {
      type: String,
      required: true,
      trim: true,
    },
    discounted_price: {
      type: String,
    },
    commentsAndRate: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "reviewAndRating",
      },
    ],
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("product", productSchema);
module.exports = ProductModel;
