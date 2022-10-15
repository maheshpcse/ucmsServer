const express = require('express');
const router = express.Router();
const authAdminCtrl = require('../controllers/authAdmin.controller');
// const authUserCtrl = require('../controllers/authUser.controller'); // TODO

// Server routes
router.get('/', (request, response, next) => {
    return response.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Basic server route works!'
    });
});

// Admin authentication routes
router.post('/test_admin_login', authAdminCtrl.testAdminLogin);
// router.post('/admin_login', authAdminCtrl.adminLogin);
// router.post('/reSignIn/admin', authAdminCtrl.adminReSignin);

// TODO: Employee authentication routes
// router.post('/login', authUserCtrl.userLogin);
// router.post('/signup', authUserCtrl.userSignup);
// router.post('/reSignIn', authUserCtrl.userReSignin);

module.exports = router;