const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');

const isAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth){
        return res.status(403).json({
            message: 'Unauthorized, JWT token required'
        })
    }
    try {
        const decode = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(403).json({
            message: 'Unauthorized, JWT token wrong or expired',
            error
        })
    }
}

const isAuthorized = async (req, res, next) => {
    try {
        const { email } = req.user;
        const fullDetail = await UserModel.findOne({ email });
        const isAdmin = fullDetail.role === 1001;
        if (!isAdmin) {
            return res.status(403).json({
                message: 'Unauthorized access'
            });
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            message: 'Unauthorized access'
        })
    }
}

module.exports = { isAuthenticated, isAuthorized };