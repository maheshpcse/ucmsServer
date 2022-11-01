const express = require('express');
const router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const authAdminCtrl = require('../controllers/authAdmin.controller.js');
const adminContactsCtrl = require('../controllers/adminContacts.controller.js');
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

// Admin Contact Save Location add/edit/delete routes
router.post('/add_update_contact_save_location', adminContactsCtrl.addOrUpdateContactSaveLocation);
router.post('/get_contact_save_locations', adminContactsCtrl.getContactSaveLocations);

// Admin Contact Group add/edit/delete routes
router.post('/add_update_contact_group', adminContactsCtrl.addOrUpdateContactGroup);
router.post('/get_contact_groups', adminContactsCtrl.getContactGroups);

// Admin Contact Sub Group add/edit/delete routes
router.post('/add_update_contact_sub_group', adminContactsCtrl.addOrUpdateContactSubGroup);

// TODO: User authentication routes
// router.post('/login', authUserCtrl.userLogin);
// router.post('/signup', authUserCtrl.userSignup);
// router.post('/reSignin', authUserCtrl.userReSignin);

module.exports = router;