const moment = require('moment');
const { ms, s, m, h, d } = require('time-convert');
const { milliseconds, seconds, minutes, hours, days } = require('time-convert');
const bcrypt = require('bcrypt');
const multer = require('multer');
const formidable = require('formidable');
const fs = require('fs');
const serverConfig = require('../config/serverConfig.js');
const spConfig = require('../config/spConfig.js');
const userSP = require('../libraries/userSP.js');
const AdminSettingsEnum = require('../enums/AdminSettings.enum.js');

// SET PATH
const DIR = './uploads/';

// SET STORAGE
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, file.fieldname + '-' + Date.now() + `.${ext}`);
    }
});

// SET DESTINATION
let uploadFile = multer({
    dest: DIR,
    storage: storage
}).single('profile');


// GET admin settings login/logout - POST METHOD
const adminSettingsLoginOrLogout = async (request, response, next) => {
    console.log('In adminSettingsLoginOrLogout(), request body isss', request.body);

    let result = {};
    let adminSettingsLoginOrLogoutData = [];
    let message = '';

    try {
        const {
            loginStatus,
            isPasswordEntered
        } = request.body;

        adminSettingsLoginOrLogoutData.push(request.body['settingsLoginName'], request.body['loginStatus']);

        console.log('Final adminSettingsLoginOrLogoutData isss:', adminSettingsLoginOrLogoutData);

        await userSP.selectDataSP(spConfig.GET_ADMIN_SETTINGS_LOGIN_OR_LOGOUT, adminSettingsLoginOrLogoutData, null).then(async resData => {
            console.log('Get admin settings login/logout resData isss', resData);

            if (resData && resData.length > 0) {
                if (loginStatus == 1) {
                    if (resData[0]['loginStatus'] == 1 && isPasswordEntered == true) {
                        const isMatchPwd = await bcrypt.compare(request.body.password, resData[0].password);
                        console.log('is Match Password isss', isMatchPwd);

                        if (isMatchPwd) {
                            message = message || 'Admin settings login successful';
                        } else {
                            message = message || 'Password is invalid';
                            throw new Error(message);
                        }
                    } else if (resData[0]['loginStatus'] == 1 && isPasswordEntered == false) {
                        message = message || 'Admin settings login successful';
                    } else if (resData[0]['loginStatus'] == 0) {
                        message = message || 'Error while updating the admin settings login status';
                        throw new Error(message);
                    }
                } else if (loginStatus == 0) {
                    message = message || 'Admin settings logout successful';
                }
                result = {
                    success: true,
                    error: false,
                    statusCode: 200,
                    message: message,
                    data: Object.assign({}, resData[0])
                }
            } else if (resData && resData.length == 0) {
                message = message || 'SettingsLoginName is invalid';
                throw new Error(message);
            }
        }).catch(errData => {
            message = message || 'Error while finding settingsLoginName';
            throw errData;
        });
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

// GET admin settings data - POST METHOD
const getAdminSettingsData = async (request, response, next) => {
    console.log('In getAdminSettingsData(), request body isss:', request.body);

    let result = {};
    let inputParamsData = [];
    let adminSettingsData = {};
    let message = '';

    try {
        inputParamsData.push(request.body['user_info_id'], request.body['settingsLoginName']);

        console.log('Final inputParamsData isss:', inputParamsData);

        await userSP.insertOrUpdateDataSP(spConfig.GET_ADMIN_SETTINGS_DATA, inputParamsData, null).then(async resData => {
            // console.log('Get admin settings data resData isss:', resData);

            adminSettingsData = resData && resData.length > 0 ? Object.assign(resData[0], {}) : {};

            result = {
                success: true,
                error: false,
                statusCode: 200,
                message: 'Get admin settings data successful',
                data: adminSettingsData
            }
        }).catch(errData => {
            message = message || 'Error while getting admin settings data';
            throw errData;
        });
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

// GET admin profile data by id - POST METHOD
const getAdminProfileById = async (request, response, next) => {
    console.log('In getAdminProfileById(), request params isss:', request.params);

    let result = {};
    let adminProfileInfo = {};
    let message = '';

    try {
        await userSP.selectDataSP(spConfig.GET_LOGIN_USER_PROFILE_BY_ID, [Number(request.params.id)], null).then(async resData => {
            // console.log('Get Admin Profile data by id resData isss:', resData);

            adminProfileInfo = resData && resData.length ? Object.assign(resData[0], {}) : {};

            result = {
                success: true,
                error: false,
                statusCode: 200,
                message: 'Get Admin Profile data by id successful',
                data: adminProfileInfo
            }
        }).catch(errData => {
            message = message || 'Error while get admin profile data by id';
            throw errData;
        });
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

// UPDATE admin profile data - POST METHOD - STEP 1
const updateAdminProfileData = async (request, response, next) => {
    console.log('In updateAdminProfileData(), request body isss:', request.body);
    console.log('In updateAdminProfileData(), request params isss:', request.params);

    let adminProfileData = [];
    let message = '';

    try {
        if (request.params && Object.keys(request.params).length > 0 && request.params['id'] !== 'null') {
            request.params['id'] = Number(request.params['id']);
        } else {
            request.params['id'] = null;
        }
        // console.log('request.params isss:', request.params);

        if (request.params['id'] > 0) {
            uploadFile(request, response, async (err) => {
                if (err) {
                    console.log('Error while upload a profile image.');
                    message = message || 'Error while upload a profile image.';
                    throw err;
                } else if (!request.file) {
                    console.log('Profile image is invalid or not uploaded properly.', request.file);
                    message = message || 'Profile image is invalid or not uploaded properly.';
                    throw new Error(message);
                } else {
                    console.log('Profile image is received.', request.file);

                    // Delete last updated Profile image file path
                    await userSP.selectDataSP(spConfig.GET_LOGIN_USER_PROFILE_BY_ID, [Number(request.params['id'])], null).then(async resData => {
                        // console.log('Get Admin Profile data by id resData isss:', resData);

                        let adminProfileInfo = resData && resData.length ? Object.assign(resData[0], {}) : {};
                        let profileImage = null;

                        if (Object.keys(adminProfileInfo).length > 0) {
                            if (adminProfileInfo['profile'] !== null && adminProfileInfo['profile'] !== '') {
                                adminProfileInfo['profile'] = Object.assign(JSON.parse(adminProfileInfo['profile']), {});
                                profileImage = Object.keys(adminProfileInfo['profile']).length > 0 ? adminProfileInfo['profile']['image'] : null;
                            }
                        }

                        if (profileImage) {
                            console.log("Deleting the profile image file path from the uploads folder.");
                            let deletePath = profileImage.substr(22);
                            if (fs.existsSync(deletePath)) {
                                fs.unlinkSync(deletePath);
                            } else {
                                console.log("The profile image file didn't exist in the uploads folder.");
                            }
                        } else {
                            console.log("The profile image file path is not saved yet.");
                        }

                        Object.assign(request.body, { 'user_data': { 'image': null } });
                        request.body['user_data']['image'] = `http://${serverConfig.server.host}:${serverConfig.server.port}/` + request.file.path;
                        request.body['user_id'] = Number(request.body['user_id']);
                        request.body['user_section'] = Number(request.body['user_section']);

                        await commonUploadProfile(request, adminProfileData).then(async resData1 => {

                            await auditAdminSettings(request, resData1['data'][0], 'successInfo');

                            return response.status(200).json(resData1);

                        }).catch(errData1 => {
                            message = message || 'Error while updating admin profile data';
                            throw errData1;
                        });
                    }).catch(errData => {
                        message = message || 'Error while get admin profile data by id';
                        throw errData;
                    });
                }
            });
        } else {
            await commonUploadProfile(request, adminProfileData).then(async resData => {

                await auditAdminSettings(request, resData['data'][0], 'successInfo');

                return response.status(200).json(resData);

            }).catch(errData => {
                message = message || 'Error while updating admin profile data';
                throw errData;
            });
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
        return response.status(200).json(result);
    }
}

// UPDATE admin password - POST METHOD
const updateAdminPassword = async (request, response, next) => {
    console.log('In updateAdminPassword(), request body isss:', request.body);

    let result = {};
    let adminPasswordData = [];
    let message = '';

    try {
        request.body['query_type'] = 0;

        // step 1: check old password is correct or not
        for (const item of Object.keys(request.body)) {
            adminPasswordData.push(request.body[item]);
        }

        console.log('First final adminPasswordData isss:', adminPasswordData);

        await userSP.selectDataSP(spConfig.UPDATE_ADMIN_PASSWORD, adminPasswordData, null).then(async resData => {
            // console.log('Get Admin login resData isss:', resData);

            const isMatchPwd = await bcrypt.compare(request.body['old_password'], resData[0]['password']);
            console.log('is Match Password isss', isMatchPwd);

            if (isMatchPwd) {
                // step 2: hash and encrypt admin new password
                await bcrypt.hash(request.body['new_password'], 10).then(async hash => {
                    console.log('hash new password isss:', hash);
                    request.body['new_password'] = hash;
                    request.body['query_type'] = 1;
                    adminPasswordData = [];
                }).catch(hashErr => {
                    message = message || 'Error while encrypt the new password';
                    throw hashErr;
                });

                // step 3: update admin password
                for (const item of Object.keys(request.body)) {
                    adminPasswordData.push(request.body[item]);
                }

                console.log('Second final adminPasswordData isss:', adminPasswordData);

                await userSP.insertOrUpdateDataSP(spConfig.UPDATE_ADMIN_PASSWORD, adminPasswordData, null).then(async resData1 => {
                    // console.log('Get Update Admin password resData isss:', resData1);

                    result = {
                        success: true,
                        error: false,
                        statusCode: 200,
                        message: 'Admin password is updated successful',
                        data: request.body['new_password']
                    }
                }).catch(errData1 => {
                    message = message || 'Error while updating admin password';
                    throw errData1;
                });
            } else {
                message = message || 'Admin old password is incorrect';
                throw new Error(message);
            }
        }).catch(errData => {
            message = message || 'Error while getting admin login data';
            throw errData;
        });
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

// GET admin settings history data - POST METHOD
const getAdminSettingsHistoryData = async (request, response, next) => {
    console.log('In getAdminSettingsHistoryData(), request body isss:', request.body);

    let result = {};
    let inputOutputParams = [];
    let settingsHistoryDataList = [];
    let settingsHistoryDataCount = 0;
    let message = '';

    try {
        for (let item of Object.keys(request.body)) {
            if (item == 'search_by') {
                request.body[item] = JSON.stringify(request.body[item]);
            }
            inputOutputParams.push(request.body[item]);
        }

        console.log('Final inputOutputParams isss:', inputOutputParams);

        // ************************ GET admin settings history list data ******************************************//
        await userSP.selectDataSP(spConfig.GET_ADMIN_SETTINGS_LOG_DATA,inputOutputParams,null).then(async resData => {
            // console.log('Get admin settings history list resData isss:', resData);

            settingsHistoryDataList = resData;

        }).catch(errData => {
            message = message || 'Error while get admin settings history list';
            throw errData;
        });

        // ************************ GET admin settings history count data ******************************************//

        inputOutputParams[6] = true;

        await userSP.selectDataSP(spConfig.GET_ADMIN_SETTINGS_LOG_DATA,inputOutputParams,null).then(async resData => {
            // console.log('Get admin settings history count resData isss:', resData);

            settingsHistoryDataCount = resData && resData.length && resData[0].hasOwnProperty('rowsCount') ? resData[0]['rowsCount'] : 0;

        }).catch(errData => {
            message = message || 'Error while get admin settings history count';
            throw errData;
        });

        result = {
            success: true,
            error: false,
            statusCode: 200,
            message: 'Get Admin Settings History list successful',
            data: {
                list: settingsHistoryDataList,
                count: settingsHistoryDataCount
            }
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

// UPDATE admin profile data - POST METHOD - STEP 2
async function commonUploadProfile(request, adminProfileData) {
    return new Promise(async (resolve, reject) => {
        let result = {};
        try {
            for (const item of Object.keys(request.body)) {
                if (item == 'user_data') {
                    request.body[item] = JSON.stringify(request.body[item]);
                }
                if (item !== 'auditName' && item !== 'requestStartTime') {
                    adminProfileData.push(request.body[item]);
                }
            }

            console.log('Final adminProfileData isss:', adminProfileData);

            await userSP.insertOrUpdateDataSP(spConfig.UPDATE_ADMIN_PROFILE_DATA, adminProfileData, null).then(async resData => {
                // console.log('Get Update Admin Profile data resData isss:', resData);

                result = {
                    success: true,
                    error: false,
                    statusCode: 200,
                    message: 'Admin profile data updated successful',
                    data: resData
                }
                resolve(result);
            }).catch(errData => {
                throw errData;
            });
        } catch (error) {
            reject(error);
        }
    });
}

// ADD admin settings history/log (i.e. audit the data) - POST METHOD
async function auditAdminSettings(request, response = {}, statusInfo = null) {
    // console.log('In auditAdminSettings(), request body isss:', request.body);
    let adminSettingsHistoryData = [];
    try {
        let timeInWordsResponse = getTimeDifferenceInWords(request, response);
        adminSettingsHistoryData[0] = response['last_updated_id'];
        adminSettingsHistoryData[1] = request.body['auditName'];
        adminSettingsHistoryData[2] = statusInfo && timeInWordsResponse !== null ? AdminSettingsEnum[request.body['auditName']][statusInfo] : 'No audit data is added.';
        adminSettingsHistoryData[3] = Object.keys(request.body).length > 0 ? JSON.stringify(request.body) : {};
        adminSettingsHistoryData[4] = moment().format('MMMM Do YYYY, h:mm:ss a');
        adminSettingsHistoryData[5] = timeInWordsResponse;

        console.log('Final adminSettingsHistoryData isss:', adminSettingsHistoryData);

        await userSP.insertOrUpdateDataSP(spConfig.ADD_ADMIN_SETTINGS_LOG_DATA, adminSettingsHistoryData, null).then(async resData => {
            // console.log('Get audit admin settings history resData isss:', resData);

        }).catch(errData => {
            throw errData;
        });
    } catch (error) {
        throw error;
    }
}

// Calucating time difference from request data to response data
function getTimeDifferenceInWords(request, response) {
    try {
        response['updated_datetime'] = moment(response['updated_datetime']).format('YYYY-MM-DD HH:mm:ss');
        console.log('updated_datetime isss:', response['updated_datetime']);

        if (response['updated_datetime'] >= request.body['requestStartTime']) {
            let diffInMilliseconds = moment(response['updated_datetime']).diff(request.body['requestStartTime'], 'milliseconds');
            console.log('Time difference in milliseconds isss:', diffInMilliseconds);
            console.log('Total time difference between request time and response time isss:', ms.to(h,m,s)(diffInMilliseconds));
    
            let timeInWords = null;
            timeInWords = ms.to(h,m,s)(diffInMilliseconds);
            
            if (timeInWords && typeof(timeInWords) == 'object' && timeInWords.length > 0) {
                return timeInWords[0] + ' hours ' + timeInWords[1] + ' minutes ' + timeInWords[2] + ' seconds';
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    adminSettingsLoginOrLogout,
    getAdminSettingsData,
    getAdminProfileById,
    updateAdminProfileData,
    updateAdminPassword,
    getAdminSettingsHistoryData
}