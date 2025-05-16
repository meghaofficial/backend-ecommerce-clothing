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

const updatePersonalInfo = async (req, res) => {
  try {
    const { fullname, phone, address } = req.body;

    if (!fullname && !phone && !address) {
      return res.status(400).json({
        message: "No data found!",
        success: false,
      });
    }

    const userId = req.user._id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        fullname,
        phone,
        address: {
          street: address?.street || user.address?.street,
          area: address?.area || user.address?.area,
          landmark: address?.landmark || user.address?.landmark,
          city: address?.city || user.address?.city,
          state: address?.state || user.address?.state,
          country: address?.country || user.address?.country,
          pincode: address?.pincode || user.address?.pincode,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully updated",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Bad Request",
      success: false,
      error: error.message,
    });
  }
};

const updateEmail = async (req, res) => {}

const updatePassword = async (req, res) => {}

module.exports = { getUserDetail, updatePersonalInfo, updateEmail, updatePassword };