'use strict';

// required npm modules
// require('./config/dbBackup.js');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const { Model } = require('objection');
const serverConfig = require('./config/serverConfig.js');
const dbConfig = require('./config/dbConfig.js');
const routes = require('./routes/routes.js');
const Knexx = require('./config/knex.js');

Model.knex(Knexx.knex);
const app = express();

// required middlewares
app.use(express.static(path.join(__dirname, '../public')));
app.use("/uploads", express.static(path.join('uploads')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(async (request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,PATCH, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Origin, Authorization, x-access-token, Content-Length, X-Requested-With, Content-Type, Accept");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

// checking database connection
app.get('/test_db_connection', dbConfig.checkDatabaseConnection);

// required routes configuration
app.use('/api', routes);

app.listen(serverConfig.server.port, () => {
    console.log(`User Contact Management System server is listening on http://${serverConfig.server.host}:${serverConfig.server.port}`);
});

module.exports = app;