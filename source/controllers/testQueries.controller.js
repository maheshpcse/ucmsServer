const moment = require('moment');
const formidable = require('formidable');
const fs = require('fs');
const serverConfig = require('../config/serverConfig.js');
const spConfig = require('../config/spConfig.js');
const userSP = require('../libraries/userSP.js');

// test sp
const testNewSp = async (request, response, next) => {
    console.log('In testNewSp(), request body isss:', request.body);

    let result = {};
    let testSPData = [];
    let message = '';

    try {
        await userSP.selectDataSP('new_test_sp', [175052, 1], null).then(async resData => {
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

// test sp - Get test authors
const testGetAuthors = async (request, response, next) => {
    console.log('In testGetAuthors(), request body isss:', request.body);

    let result = {};
    let inputParamsData = [];
    let testEmployees = [];
    let message = '';

    try {
        inputParamsData.push(request.body['limit'], request.body['page'], request.body['search_query']);

        console.log('Final inputParamsData isss:', inputParamsData);

        await userSP.selectDataSP('test_sp_get_authors_by_posts', inputParamsData, null).then(async resData => {
            console.log('Get test authors resData isss:', resData.length);

            testEmployees = resData;

        }).catch(errData => {
            message = message || 'Error while test authors data';
            throw errData;
        });

        result = {
            success: true,
            error: false,
            statusCode: 200,
            message: 'Get test authors data successful',
            data: testEmployees
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
    testNewSp,
    testGetAuthors
}