const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const cookie = require('cookie');
const config = require('../config/serverConfig.js');
const userSP = require('../libraries/userSP.js');
const Admins = require('../models/Admin_login.model.js');

const adminLogin = async (request, response, next) => {
    console.log('request body isss', request.body);
    let adminData = {};
    let message = '';
    try {
        const {
            nameOrEmail,
            password
        } = request.body;

        await Admins.query(request.knex)
            .select('a.*')
            .alias('a')
            .whereRaw(`a.displayName = '${nameOrEmail}' OR a.email = '${nameOrEmail}'`)
            .then(async result => {
                console.log('Get admin login result isss', result);

                if (result && result.length) {
                    const match = await bcrypt.compare(password, result[0].password);
                    console.log('match password isss', match);

                    if (match) {
                        adminData = Object.assign({}, result[0]);
                        const token = JWT.sign({
                            adminId: adminData.adminId,
                            displayName: adminData.displayName,
                            email: adminData.email
                        }, config.database.securitykey, {
                            algorithm: 'HS256',
                            expiresIn: '1hr'
                        });
                        adminData['token'] = token;
                        adminData['refreshToken'] = token;
                        const minutes = 1440;
                        const expTimeInMS = new Date().getTime() + (minutes * 60 * 1000);
                        var cookieData = cookie.serialize('elmstoken', token);
                        cookieData = cookieData.concat(';Expires=' + new Date(expTimeInMS).toUTCString() + `;HttpOnly;Secure;Path=/`);
                        var prev = response.getHeader('set-cookie') || [];
                        var header = Array.isArray(prev) ? prev.concat(cookieData)
                            : Array.isArray(cookieData) ? [prev].concat(cookieData)
                                : [prev, cookieData];
                        console.log('final header isss:', header);
                        response.setHeader('set-cookie', header);
                    } else {
                        message = 'Password is invalid';
                        throw new Error(message);
                    }
                } else if (result && result.length == 0) {
                    message = 'Username or Email ID is invalid'
                    throw new Error(message);
                } else {
                    message = 'Error while generating token'
                    throw new Error(message);
                }

            }).catch(getErr => {
                message = message || 'Error while finding username or email id';
                throw getErr;
            });

        return response.status(200).json({
            success: true,
            error: false,
            statusCode: 200,
            message: 'Admin login successful',
            data: adminData
        });
    } catch (error) {
        console.log('Error at try catch API result', error);
        return response.status(200).json({
            success: false,
            error: true,
            statusCode: 500,
            message: message || 'Error at try catch API result',
            data: []
        });
    }
}

const validateAdmin = async (request, response, next) => {
    console.log('request body isss', request.headers);
    let adminData = {};
    let message = '';
    try {
        let token = request.headers['authorization'] || request.headers['x-access-token'];
        console.log('token isss:', token);

        if (!token || token === '') {
            message = 'Token is empty';
            throw new Error(message);
        }

        token = token.split(',')[0];

        console.log('final token isss', token);

        await JWT.verify(token, config.database.securitykey, async (err, decoded) => {
            if (err) {
                console.log('error data isss:', err);
                message = err && err.message ? err.message : 'Error while jwt verification';
                throw new Error(message);
            } else {
                console.log('decoded data isss:', decoded);
                await Admins.query(request.knex)
                    .select('a.*')
                    .alias('a')
                    .whereRaw(`a.displayName = '${decoded.displayName}'`)
                    .then(async data => {
                        console.log('Get admin data isss', data);
                        adminData = data && data.length ? data[0] : {};
                        if (adminData && Object.keys(adminData).length == 0) {
                            message = 'Admin data not found'
                            throw new Error(message);
                        } else if (decoded.displayName === adminData.displayName) {
                            next();
                        } else {
                            message = 'Token is invalid'
                            throw new Error(message);
                        }
                    }).catch(getErr => {
                        message = 'Error while gettign admin data';
                        throw getErr;
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
            data: []
        });
    }
}

const adminReSignin = async (request, response, next) => {
    console.log('request body isss', request);
    let adminData = {};
    let message = '';
    try {
        const {
            displayName,
            refreshToken
        } = request.body;

        await JWT.verify(refreshToken, config.database.securitykey, (err, decoded) => {
            if (err) {
                console.log('Error isss:', err);
                message = err && err['message'] ? err['message'] : 'Erroo while verifying token';
                throw new Error(message);
            } else {
                console.log('decoded data isss:', decoded);

                if (decoded.displayName === displayName) {
                    adminData = Object.assign({}, decoded);
                    const accessToken = JWT.sign({
                        adminId: adminData.adminId,
                        displayName: adminData.displayName,
                        email: adminData.email
                    }, config.database.securitykey, {
                        algorithm: 'HS256',
                        expiresIn: '30m'
                    });
                    const refreshToken = JWT.sign({
                        adminId: adminData.adminId,
                        displayName: adminData.displayName,
                        email: adminData.email
                    }, config.database.securitykey, {
                        algorithm: 'HS256',
                        expiresIn: '1hr'
                    });
                    adminData['token'] = accessToken;
                    adminData['accessToken'] = accessToken;
                    adminData['refreshToken'] = refreshToken;
                    delete adminData['exp'];
                    delete adminData['iat'];
                } else {
                    message = 'displayName is invalid'
                    throw new Error(message);
                }
            }
        });

        return response.status(200).json({
            success: true,
            error: false,
            statusCode: 200,
            message: 'Admin reSignIn successful',
            data: adminData
        });
    } catch (error) {
        console.log('Error at try catch API result', error);
        return response.status(200).json({
            success: false,
            error: true,
            statusCode: 500,
            message: message || 'Error at try catch API result',
            data: []
        });
    }
}

// test admin login
const testAdminLogin = async (request, response, next) => {
    console.log('request body isss', request.body);

    let result = {};
    let message = '';

    try {
        const inputParams = {
            ip_adminLoginName: request.body.adminLoginName,
            ip_password: request.body.password
        }

        await userSP.selectDataSP('get_admin_login', [inputParams.ip_adminLoginName], null).then(resData => {
            console.log('Get admin login data isss', resData);

            result = {
                success: true,
                error: false,
                statusCode: 200,
                message: 'Admin login successful',
                data: resData
            }
        }).catch(errData => {
            message = message || 'Error while get admin login data';
            throw new Error(errData);
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
    validateAdmin,
    adminReSignin,
    testAdminLogin
}