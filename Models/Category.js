const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
      categoryId: {
            type: String, 
            required: true
      },
      categoryName: {
            type: String,
            required: true
      },
      noOfProducts: {
            type: Number,
            default: 0
      }
}, { timestamps: true });

const CategoryModel = mongoose.model("category", CategorySchema);
module.exports = CategoryModel;