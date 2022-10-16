const mysql = require('mysql');
const bcrypt = require('bcrypt');
const serverConfig = require('./serverConfig.js');
const spConfig = require('../config/spConfig.js');
const userSP = require('../libraries/userSP.js');

const connection = mysql.createConnection({
    host: serverConfig.database.host,
    port: serverConfig.database.port,
    user: serverConfig.database.username,
    password: serverConfig.database.password,
    database: serverConfig.database.db,
    multipleStatements: true,
    charset: 'utf8'
});

// checking database connection with mysql config
const checkDatabaseConnection = async (request, response, next) => {
    await connection.connect(function (err, data) {
        if (err) {
            const result = {
                data: err
            }
            if (result.data.errno === 'ECONNREFUSED') {
                console.log("Databse connection refused, check your database connection", err);
                return response.status(200).json({
                    success: false,
                    statusCode: 500,
                    message: 'Databse connection refused, check your database connection',
                    data: err,
                });
            } else if (result.data.code === 'ER_ACCESS_DENIED_ERROR') {
                console.log("Database access denied for user, check your database credentials", err);
                return response.status(200).json({
                    success: false,
                    statusCode: 500,
                    message: 'Database access denied for user, check your database credentials',
                    data: err,
                });
            }
        } else if (data) {
            console.log("Database connection established", data);
            return response.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Database connection established',
                data: data
            });
        }
    });
}

// add default user data - POST METHOD
const addDefaultUserData = async (request, response, next) => {
    console.log('In addDefaultUserData(), request body isss', request.body);

    let result = {};
    let message = '';

    try {
        const defaultUserData = [null, 'test master', 'master', 'master123@gmail.com', '9876543210', '8th block, koramangala', 'Bengaluru', 'Karnataka', 'admin', 1, new Date(), new Date()];
        
        await userSP.insertOrUpdateDataSP(spConfig.ADD_DEFAULT_USER_DATA, defaultUserData, null).then(resData => {
            console.log('Get added default user resData isss', resData);

            result = {
                success: true,
                error: false,
                statusCode: 200,
                message: 'Default user data is added successful',
                data: resData
            }
        }).catch(errData => {
            message = message || 'Error while adding default user data';
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

// add default admin data - POST METHOD
const addDefaultAdminData = async (request, response, next) => {
    console.log('In addDefaultAdminData(), request body isss', request.body);

    let result = {};
    let message = '';

    try {
        const defaultAdminData = [null, 1, 'master', '1234', null, 1, new Date(), new Date()];

        // hash and encrypt employee password
        await bcrypt.hash(defaultAdminData[3], 10).then(async hash => {
            console.log('hash password isss:', hash);
            defaultAdminData[3] = hash;
        }).catch(hashErr => {
            message = 'Error while encrypt the password';
            throw hashErr;
        });
        
        await userSP.insertOrUpdateDataSP(spConfig.ADD_DEFAULT_ADMIN_DATA, defaultAdminData, null).then(resData => {
            console.log('Get added default admin resData isss', resData);

            result = {
                success: true,
                error: false,
                statusCode: 200,
                message: 'Default admin data is added successful',
                data: resData
            }
        }).catch(errData => {
            message = message || 'Error while adding default admin data';
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

module.exports = {
    connection,
    checkDatabaseConnection,
    addDefaultUserData,
    addDefaultAdminData
};