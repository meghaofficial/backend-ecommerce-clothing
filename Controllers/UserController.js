const UserModel = require("../Models/User");

const getUserDetail = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findOne({ _id: userId }).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Bad Request",
      success: false,
    });
  }
};

module.exports = { getUserDetail };