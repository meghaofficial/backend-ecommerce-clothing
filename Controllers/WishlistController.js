const ProductModel = require("../Models/Product");
const UserModel = require("../Models/User");
const WishlistModel = require("../Models/Wishlist");

const getWishlist = async (req, res) => {
  try {

    const userId = req.user._id;

    // const wishlist = await WishlistModel.findOne({ userId }).populate("list");
    const wishlist = await WishlistModel.findOne({ userId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist is empty",
        wishlist: [],
      });
    }

     return res.status(200).json({
      success: true,
      wishlist: wishlist.list, 
    });

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Bad Request",
      success: false,
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const [user, product, wishlist] = await Promise.all([
      UserModel.findById(userId),
      ProductModel.findById(productId),
      WishlistModel.findOne({ userId }),
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product does not exist",
      });
    }

    if (wishlist) {
      if (wishlist.list.includes(productId)) {
        return res.status(200).json({
          success: true,
          message: "Wishlist already exists",
          wishlist,
        });
      }
      wishlist.list.push(productId);
      await wishlist.save();
      return res.status(200).json({
        success: true,
        message: "Updated wishlist successfully",
        wishlist,
      });
    } else {
      const newWishlist = await WishlistModel.create({
        userId,
        list: [productId],
      });
      return res.status(200).json({
        success: true,
        message: "Updated wishlist successfully",
        wishlist: newWishlist,
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};


const deleteWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const wishlist = await WishlistModel.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    const index = wishlist.list.indexOf(productId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    wishlist.list.pull(productId);
    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: wishlist.list,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};


module.exports = { getWishlist, addToWishlist, deleteWishlist };
