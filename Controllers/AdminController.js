const UserModel = require("../Models/User");

const getUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await UserModel.findOne({ _id });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).send({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    return res.status(200).json({
      users: allUsers,
      totalUsers: allUsers.length,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const getOnlyUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find({ role: 1000 });
    return res.status(200).json({
      users: allUsers,
      totalUsers: allUsers.length,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const allAdmins = await UserModel.find({ role: 1001 });
    return res.status(200).json({
      users: allAdmins,
      totalUsers: allAdmins.length,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exists",
        success: false,
      });
    }
    await UserModel.deleteOne({ email });

    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "400 Bad Request",
      success: false,
      error,
    });
  }
};

const searchUser = async (req, res) => {
  try {
    const { searchQuery } = req.body;

    const allUsers = await UserModel.find();

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: "Can not process",
      });
    }

    if (allUsers.length > 0) {
      const filteredUsers = allUsers.filter((user) => {
        return (
          user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        // || (user?.address && user?.address?.toLowerCase()?.includes(searchQuery.toLowerCase())) ||
        // (user?.phone && user?.phone?.toLowerCase()?.includes(searchQuery.toLowerCase()))
      });
      return res.status(200).json({
        success: true,
        message: "All filtered users",
        filteredUsers,
        size: filteredUsers.length,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User does not exists",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "400 Bad Request",
      success: false,
      error,
    });
  }
};

const makeOrRemoveAdmin = async (req, res) => {
  try {
    const { id, makeAdmin } = req.body;
    const user = await UserModel.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { role: makeAdmin ? 1001 : 1000 },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully Updated",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "400 Bad Request",
      success: false,
      error,
    });
  }
};

module.exports = {
  getUser,
  getAllUsers,
  getOnlyUsers,
  getAllAdmins,
  deleteUser,
  searchUser,
  makeOrRemoveAdmin,
};
