const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const serverConfig = require('../config/serverConfig.js');
const spConfig = require('../config/spConfig.js');
const userSP = require('../libraries/userSP.js');

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
                        username: adminLoginData.username
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
                        username: adminLoginData.username
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

module.exports = {
    adminLogin,
    validateAdminLogin,
    adminReSignin
}