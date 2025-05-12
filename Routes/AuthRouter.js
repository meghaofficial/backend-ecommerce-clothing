const { loginController, signupController, verifyEmail } = require('../Controllers/AuthController');

const router = require('express').Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/signup/verify', verifyEmail);

module.exports = router;