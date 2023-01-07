const moment = require('moment');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const multer = require('multer');
const formidable = require('formidable');
const fs = require('fs');
const serverConfig = require('../config/serverConfig.js');
const spConfig = require('../config/spConfig.js');
const userSP = require('../libraries/userSP.js');

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

// GET admin login - POST METHOD
const adminLogin = async (request, response, next) => {
    console.log('In adminLogin(), request body isss', request.body);

    let result = {};
    let adminLoginData = {};
    let message = '';

    try {
        const inputParams = {
            ip_adminLoginName: request.body.adminLoginName,
            ip_password: request.body.password
        }

        await userSP.selectDataSP(spConfig.GET_ADMIN_LOGIN, [inputParams.ip_adminLoginName], null).then(async resData => {
            console.log('Get admin login resData isss', resData);

            if (resData && resData.length > 0) {
                const isMatchPwd = await bcrypt.compare(request.body.password, resData[0].password);
                console.log('is Match Password isss', isMatchPwd);

                if (isMatchPwd) {
                    adminLoginData = Object.assign({}, resData[0]);

                    const encryptData = {
                        admin_id: adminLoginData.admin_id,
                        user_info_id: adminLoginData.user_info_id,
                        adminLoginName: adminLoginData.adminLoginName,
                        username: adminLoginData.username,
                        email: adminLoginData.email,
                        role: adminLoginData.role
                    }
                    const accessToken = JWT.sign(encryptData, serverConfig.database.securitykey, {
                        algorithm: 'HS256',
                        expiresIn: '30m'
                    });
                    const refreshToken = JWT.sign(encryptData, serverConfig.database.securitykey, {
                        algorithm: 'HS256',
                        expiresIn: '1hr'
                    });

                    adminLoginData['token'] = accessToken;
                    adminLoginData['accessToken'] = accessToken;
                    adminLoginData['refreshToken'] = refreshToken;
                    adminLoginData['issued'] = moment().format('YYYY-MM-DD HH:mm:ss');
                    adminLoginData['expired'] = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');

                    result = {
                        success: true,
                        error: false,
                        statusCode: 200,
                        message: 'Admin login successful',
                        data: adminLoginData
                    }
                } else {
                    message = message || 'Password is invalid';
                    throw new Error(message);
                }
            } else if (resData && resData.length == 0) {
                message = message || 'AdminLoginName is invalid';
                throw new Error(message);
            }

        }).catch(errData => {
            message = message || 'Error while finding adminLoginName';
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

// validate Admin login - POST METHOD
const validateAdminLogin = async (request, response, next) => {
    console.log('In validateAdmin(), request body isss', request.headers);

    let adminLoginData = {};
    let message = '';

    try {
        let authorizedToken = request.body.token || request.query.token || request.headers['authorization'] || request.headers['x-access-token'];
        console.log('authorizedToken isss:', authorizedToken);

        if (!authorizedToken || authorizedToken === '') {
            message = 'Token is not found';
            throw new Error(message);
        } else {
            authorizedToken = authorizedToken.split(',')[0];
        }

        console.log('Final authorizedToken isss', authorizedToken);

        await JWT.verify(authorizedToken, serverConfig.database.securitykey, async (err, decoded) => {
            if (err) {
                console.log('Error jwt token verification data isss:', err);
                message = err && err.message ? err.message : 'Error while verifying the jwt token';
                throw new Error(message);
            } else {
                console.log('decoded data isss:', decoded);

                await userSP.selectDataSP(spConfig.GET_ADMIN_LOGIN, [decoded.adminLoginName], null).then(async resData => {
                    console.log('Get admin login resData isss', resData);

                    adminLoginData = resData && resData.length ? resData[0] : {};

                    if (adminLoginData && Object.keys(adminLoginData).length == 0) {
                        message = message || 'Admin Login data is invalid or not found';
                        throw new Error(message);
                    } else if (decoded.username == adminLoginData.username) {
                        next();
                    } else {
                        message = message || 'Token is invalid';
                        throw new Error(message);
                    }

                }).catch(errData => {
                    message = message || 'Error while gettign admin data';
                    throw errData;
                });
            }
        });
    } catch (error) {
        console.log('Error at try catch API result', error);

        return response.status(200).json({
            success: false,
            error: true,
            statusCode: 500,
            message: message || 'Error at try catch API result',
            data: error
        });
    }
}

// GET admin re-signin - POST METHOD
const adminReSignin = async (request, response, next) => {
    console.log('In adminReSignin(), request body isss', request.body);

    let result = {};
    let adminLoginData = {};
    let message = '';

    try {
        const {
            username,
            refreshToken
        } = request.body;

        await JWT.verify(refreshToken, serverConfig.database.securitykey, (err, decoded) => {
            if (err) {
                console.log('Error jwt token verification data isss:', err);
                message = err && err['message'] ? err['message'] : 'Error while verifying jwt token';
                throw new Error(message);
            } else {
                console.log('decoded data isss:', decoded);

                if (decoded.username === username) {
                    adminLoginData = Object.assign({}, decoded);

                    const encryptData = {
                        admin_id: adminLoginData.admin_id,
                        user_info_id: adminLoginData.user_info_id,
                        adminLoginName: adminLoginData.adminLoginName,
                        username: adminLoginData.username,
                        email: adminLoginData.email,
                        role: adminLoginData.role
                    }
                    const accessToken = JWT.sign(encryptData, serverConfig.database.securitykey, {
                        algorithm: 'HS256',
                        expiresIn: '30m'
                    });
                    const refreshToken = JWT.sign(encryptData, serverConfig.database.securitykey, {
                        algorithm: 'HS256',
                        expiresIn: '1hr'
                    });

                    adminLoginData['token'] = accessToken;
                    adminLoginData['accessToken'] = accessToken;
                    adminLoginData['refreshToken'] = refreshToken;
                    delete adminLoginData['exp'];
                    delete adminLoginData['iat'];

                    result = {
                        success: true,
                        error: false,
                        statusCode: 200,
                        message: 'Admin Re-Signin successful',
                        data: adminLoginData
                    }
                } else {
                    message = message || 'Username is invalid';
                    throw new Error(message);
                }
            }
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
        await userSP.selectDataSP(spConfig.GET_LOGIN_USER_PROFILE_BY_ID,[Number(request.params.id)],null).then(async resData => {
            // console.log('Get Admin Profile data by id resData isss:', resData);

            adminProfileInfo = resData && resData.length ? Object.assign(resData[0], {}) : {};

        }).catch(errData => {
            message = message || 'Error while get admin profile data by id';
            throw errData;
        });

        result = {
            success: true,
            error: false,
            statusCode: 200,
            message: 'Get Admin Profile data by id successful',
            data: adminProfileInfo
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
                    await userSP.selectDataSP(spConfig.GET_LOGIN_USER_PROFILE_BY_ID,[Number(request.params['id'])],null).then(async resData => {
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

                        await commonUploadProfile(request, adminProfileData).then(resData1 => {

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
            await commonUploadProfile(request, adminProfileData).then(resData => {

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

// UPDATE admin password - POST METHOD - STEP 1
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

        await userSP.selectDataSP(spConfig.UPDATE_ADMIN_PASSWORD,adminPasswordData,null).then(async resData => {
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

                await userSP.insertOrUpdateDataSP(spConfig.UPDATE_ADMIN_PASSWORD,adminPasswordData,null).then(async resData1 => {
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

// UPDATE admin profile data - POST METHOD - STEP 2
function commonUploadProfile(request, adminProfileData) {
    return new Promise(async (resolve, reject) => {
        let result = {};
        try {
            for (const item of Object.keys(request.body)) {
                if (item == 'user_data') {
                    request.body[item] = JSON.stringify(request.body[item]);
                }
                adminProfileData.push(request.body[item]);
            }
    
            console.log('Final adminProfileData isss:', adminProfileData);

            await userSP.insertOrUpdateDataSP(spConfig.UPDATE_ADMIN_PROFILE_DATA,adminProfileData,null).then(async resData => {
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

// test sp
const testNewSp = async (request, response, next) => {
    console.log('In testNewSp(), request body isss:', request.body);

    let result = {};
    let testSPData = [];
    let message = '';

    try {
        await userSP.selectDataSP('new_test_sp',[175052,1],null).then(async resData => {
            console.log('Get new test sp resData isss:', resData);

            testSPData = resData;

        }).catch(errData => {
            message = message || 'Error while new test sp data';
            throw errData;
        });

        result = {
            success: true,
            error: false,
            statusCode: 200,
            message: 'Get new test sp data successful',
            data: testSPData
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

module.exports = {
    adminLogin,
    validateAdminLogin,
    adminReSignin,
    getAdminProfileById,
    updateAdminProfileData,
    updateAdminPassword,
    testNewSp
}