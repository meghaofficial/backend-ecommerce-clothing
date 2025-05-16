const router = require('express').Router();
const { getUserDetail, updatePersonalInfo, updateEmail, updatePassword } = require('../Controllers/UserController');
const { isAuthenticated } = require('../Middlewares/Auth');

router.get('/profile', isAuthenticated, getUserDetail);
router.put('/update-personal-info', isAuthenticated, updatePersonalInfo);
router.put('/update-email', isAuthenticated, getUserDetail, updateEmail);
router.put('/update-password', isAuthenticated, getUserDetail, updatePassword);

module.exports = router