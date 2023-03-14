const moment = require('moment');
const updateDate = moment().format('MMMM DD, YYYY');
const updateTime = moment().format('LT');

// Setting Pages
const USER_PROFILE = 'user_profile';
const USER_PERSONAL_INFORMATION = 'user_personal_information';
const USER_CONTACT_INFORMATION = 'user_contact_information';
const USER_ABOUT_ME = 'user_about_me';
const USER_ONLINE_PROFILE = 'user_online_profile';
const USER_WORK_INFORMATION = 'user_work_information';

// Success detailed information
const SUCCESS = {
    [USER_PROFILE]: `The user profile was updated on ${updateDate} at ${updateTime}.`,
    [USER_PERSONAL_INFORMATION]: `The user's personal data was updated on ${updateDate} at ${updateTime}.`
}

// Error detailed information
const ERROR = {
    [USER_PROFILE]: '',
    [USER_PERSONAL_INFORMATION]: ''
}

module.exports = {
    [USER_PROFILE]: {
        successInfo: SUCCESS.user_profile,
        errorInfo: ERROR.user_profile
    },
    [USER_PERSONAL_INFORMATION]: {
        successInfo: SUCCESS.user_personal_information,
        errorInfo: ERROR.user_personal_information
    }
}