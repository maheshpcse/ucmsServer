const _ = require('underscore');
const serverConfig = require('../config/serverConfig.js');
const spConfig = require('../config/spConfig.js');
const userSP = require('../libraries/userSP.js');
const AdminLogin = require('../models/Admin_login.model.js');
const UserInfo = require('../models/User_info.model.js');

// ADD new contact/sync contacts - POST METHOD
const addNewContact = (request, response, next) => {
    console.log('In addNewContact(), request body isss', request.body);

    let result = {};
    let contactData = [];
    let message = '';

    try {
        result = {
            success: true,
            error: false,
            statusCode: 200,
            message: 'New contact(s) added successful',
            data: []
        }
    } catch (error) {
        console.log('Error at try catch API result', error);
        result = {
            success: false,
            error: true,
            statusCode: 500,
            message: message || 'Error at try catch API result',
            data: error
        }
    }

    return response.status(200).json(result);
}