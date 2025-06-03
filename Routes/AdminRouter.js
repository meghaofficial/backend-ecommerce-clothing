const { getUser, getAllUsers, getAllAdmins, getOnlyUsers, deleteUser, searchUser, makeOrRemoveAdmin } = require('../Controllers/AdminController');
const { isAuthenticated, isAuthorized } = require('../Middlewares/Auth');
const router = require('express').Router();

router.get('/account/:_id', isAuthenticated, isAuthorized, getUser);
router.get('/all-users', isAuthenticated, isAuthorized, getAllUsers);
router.get('/users', isAuthenticated, isAuthorized, getOnlyUsers);
router.get('/admins', isAuthenticated, isAuthorized, getAllAdmins);
router.delete('/delete-user', isAuthenticated, isAuthorized, deleteUser);
router.post('/search-user', isAuthenticated, isAuthorized, searchUser);
router.put('/update-authority', isAuthenticated, isAuthorized, makeOrRemoveAdmin);

module.exports = router