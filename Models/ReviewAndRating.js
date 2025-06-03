const mongoose = require("mongoose");

const ReviewAndRatingSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
}, { timestamps: true });

const ReviewAndRatingModel = mongoose.model(
  "reviewAndRating",
  ReviewAndRatingSchema
);
module.exports = ReviewAndRatingModel;
