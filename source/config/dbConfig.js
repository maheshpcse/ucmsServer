const mysql = require('mysql');
const serverConfig = require('./serverConfig.js');

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
const checkDatabaseConnection = (request, response, next) => {
    connection.connect(function (err, data) {
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

module.exports = {
    connection,
    checkDatabaseConnection
};