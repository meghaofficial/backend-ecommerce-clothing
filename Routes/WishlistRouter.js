const { getWishlist, addToWishlist, deleteWishlist } = require("../Controllers/WishlistController");
const { isAuthenticated } = require("../Middlewares/Auth");

const router = require("express").Router();

router.route("/wishlist").get(isAuthenticated, getWishlist).post(isAuthenticated, addToWishlist).delete(isAuthenticated, deleteWishlist);

module.exports = router;