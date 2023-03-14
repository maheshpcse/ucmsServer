const express = require('express');
const router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const testQueriesCtrl = require('../controllers/testQueries.controller.js');
const authAdminCtrl = require('../controllers/authAdmin.controller.js');
const adminSettingsCtrl = require('../controllers/adminSettings.controller.js');
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

// test queries & sp's
router.get('/test_new_sp', testQueriesCtrl.testNewSp);
router.post('/get_test_authors', testQueriesCtrl.testGetAuthors);

// Admin authentication routes
router.post('/add_default_user_info_data', dbConfig.addDefaultUserInfoData);
router.post('/add_default_admin_login_data', dbConfig.addDefaultAdminLoginData);
router.post('/add_default_admin_settings_login_data', dbConfig.addDefaultAdminSettingsLoginData);
router.post('/admin_login', authAdminCtrl.adminLogin);
// TODO: Admin signup pending
// TODO: Admin forgot password pending
router.post('/admin_resignin', authAdminCtrl.validateAdminLogin, authAdminCtrl.adminReSignin);
router.get('/home', authAdminCtrl.validateAdminLogin, (request, response, next) => {
    return response.status(200).send('Navigated to home page!');
});
router.post('/admin_settings_login', authAdminCtrl.validateAdminLogin, adminSettingsCtrl.adminSettingsLoginOrLogout);
router.post('/admin_settings_logout', authAdminCtrl.validateAdminLogin, adminSettingsCtrl.adminSettingsLoginOrLogout);
router.post('/get_admin_settings_data', authAdminCtrl.validateAdminLogin, adminSettingsCtrl.getAdminSettingsData);
router.post('/admin_and_settings_logout', authAdminCtrl.validateAdminLogin, authAdminCtrl.getAdminAndSettingsLogout);
router.get('/get_admin_profile_by_id/:id', authAdminCtrl.validateAdminLogin, adminSettingsCtrl.getAdminProfileById);
router.put('/update_admin_profile_data/:id', authAdminCtrl.validateAdminLogin, adminSettingsCtrl.updateAdminProfileData);
router.put('/update_admin_password', authAdminCtrl.validateAdminLogin, adminSettingsCtrl.updateAdminPassword);
router.post('/get_admin_settings_history_data', adminSettingsCtrl.getAdminSettingsHistoryData);

// Admin Contact Save Location add/edit/delete routes
router.post('/add_update_contact_save_location', authAdminCtrl.validateAdminLogin, adminContactsCtrl.addOrUpdateContactSaveLocation);
router.post('/get_contact_save_locations', authAdminCtrl.validateAdminLogin, adminContactsCtrl.getContactSaveLocations);

// Admin Contact Group add/edit/delete routes
router.post('/add_update_contact_group', authAdminCtrl.validateAdminLogin, adminContactsCtrl.addOrUpdateContactGroup);
router.post('/get_contact_groups', authAdminCtrl.validateAdminLogin, adminContactsCtrl.getContactGroups);

// Admin Contact Sub Group add/edit/delete routes
router.post('/add_update_contact_sub_group', authAdminCtrl.validateAdminLogin, adminContactsCtrl.addOrUpdateContactSubGroup);

// TODO: User authentication routes
// router.post('/login', authUserCtrl.userLogin);
// router.post('/signup', authUserCtrl.userSignup);
// router.post('/reSignin', authUserCtrl.userReSignin);

module.exports = router;