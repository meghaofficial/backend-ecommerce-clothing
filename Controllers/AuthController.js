const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const bcrypt = require("bcrypt");
const { sendVerificationCode, welcomeEmail } = require("../Middlewares/Email");

const verifyEmail = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      otp,
      originalVerificationCode,
    } = req.body;

    if (+otp !== +originalVerificationCode) {
      return res.status(401).json({
        message: "Invalid verification code",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      fullname,
      email,
      password: hashedPassword,
      isVerified: true, // now verified
    });

    await user.save();

    welcomeEmail(email, fullname);

    return res.status(201).json({
      message: "Signup successful",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "",
      success: false,
    });
  }
};

const signupController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    sendVerificationCode(email, verificationCode);

    return res.status(200).json({
      message: "OTP sent to email",
      success: true,
      verificationCode, 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      message: "Login Successfully",
      success: true,
      jwtToken,
      email,
      name: user.fullname,
      _id: user._id,
      phone: "", 
      address: "", 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error
    });
  }
};

module.exports = { signupController, loginController, verifyEmail };