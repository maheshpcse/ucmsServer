const express = require('express');
const router = express.Router();
const dbConfig = require('../config/dbConfig.js');
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
router.post('/add_default_user_data', dbConfig.addDefaultUserData);
router.post('/add_default_admin_data', dbConfig.addDefaultAdminData);
router.post('/admin_login', authAdminCtrl.adminLogin);
router.post('/admin_reSignin', authAdminCtrl.adminReSignin);
router.get('/home', authAdminCtrl.validateAdminLogin, (request, response, next) => {
    return response.status(200).send('Navigated to home page!');
});

// Admin Contacts add/edit/delete routes

// TODO: User authentication routes
// router.post('/login', authUserCtrl.userLogin);
// router.post('/signup', authUserCtrl.userSignup);
// router.post('/reSignin', authUserCtrl.userReSignin);

module.exports = router;