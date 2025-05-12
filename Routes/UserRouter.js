const router = require('express').Router();
const { getUserDetail } = require('../Controllers/UserController');
const { isAuthenticated } = require('../Middlewares/Auth');

router.get('/profile', isAuthenticated, getUserDetail);

module.exports = router