const _ = require('underscore');
const serverConfig = require('../config/serverConfig.js');
const spConfig = require('../config/spConfig.js');
const userSP = require('../libraries/userSP.js');
const AdminLogin = require('../models/Admin_login.model.js');
const UserInfo = require('../models/User_info.model.js');

// ADD or UPDATE contact save location data - POST METHOD
const addOrUpdateContactSaveLocation = async (request, response, next) => {
    console.log('In addOrUpdateContactSaveLocation(), request body isss:', request.body);

    let result = {};
    let contactSavedLocationData = [];
    let message = '';

    try {
        const {
            csl_id
        } = request.body;

        for (const item of Object.keys(request.body)) {
            contactSavedLocationData.push(request.body[item]);
        }

        console.log('Final contactSavedLocationData isss:', contactSavedLocationData);

        await userSP.insertOrUpdateDataSP(spConfig.ADD_UPDATE_CONTACT_SAVE_LOCATION,contactSavedLocationData,null).then(async resData => {
            console.log('Get addOrUpdate Contact Save Location resData isss:', resData);

            result = {
                success: true,
                error: false,
                statusCode: 200,
                message: csl_id ? 'Contact Save Location updated successful' : 'New Contact Save Location added successful',
                data: resData
            }
        }).catch(errData => {
            message = message || 'Error while insert or update contact save location';
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

// GET contact save locations data - POST METHOD
const getContactSaveLocations = async (request, response, next) => {
    console.log('In getContactSaveLocations(), request body isss:', request.body);

    let result = {};
    let inputOutputParams = [];
    let contactSavedLocationsDataList = [];
    let contactSavedLocationsDataCount = 0;
    let message = '';

    try {
        for (let item of Object.keys(request.body)) {
            if (item == 'search_by') {
                request.body[item] = JSON.stringify(request.body[item]);
            }
            inputOutputParams.push(request.body[item]);
        }

        console.log('Final inputOutputParams isss:', inputOutputParams);

        // ************************ GET contact save locations list data ******************************************//
        await userSP.selectDataSP(spConfig.GET_CONTACT_SAVE_LOCATIONS,inputOutputParams,null).then(async resData => {
            // console.log('Get Contact Save Locations list resData isss:', resData);

            contactSavedLocationsDataList = resData;

        }).catch(errData => {
            message = message || 'Error while get contact save locations list';
            throw errData;
        });

        // ************************ GET contact save locations count data ******************************************//

        inputOutputParams[6] = true;

        await userSP.selectDataSP(spConfig.GET_CONTACT_SAVE_LOCATIONS,inputOutputParams,null).then(async resData => {
            // console.log('Get Contact Save Locations count resData isss:', resData);

            contactSavedLocationsDataCount = resData && resData.length && resData[0].hasOwnProperty('rowsCount') ? resData[0]['rowsCount'] : 0;

        }).catch(errData => {
            message = message || 'Error while get contact save locations count';
            throw errData;
        });

        result = {
            success: true,
            error: false,
            statusCode: 200,
            message: 'Get Contact Save Locations list successful',
            data: {
                list: contactSavedLocationsDataList,
                count: contactSavedLocationsDataCount
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

// ADD or UPDATE contact group data - POST METHOD
const addOrUpdateContactGroup = async (request, response, next) => {
    console.log('In addOrUpdateContactGroup(), request body isss:', request.body);

    let result = {};
    let contactGroupData = [];
    let message = '';

    try {
        const {
            cg_id
        } = request.body;

        for (const item of Object.keys(request.body)) {
            contactGroupData.push(request.body[item]);
        }

        console.log('Final contactGroupData isss:', contactGroupData);

        await userSP.insertOrUpdateDataSP(spConfig.ADD_UPDATE_CONTACT_GROUP,contactGroupData,null).then(async resData => {
            console.log('Get addOrUpdate Contact Group resData isss:', resData);

            result = {
                success: true,
                error: false,
                statusCode: 200,
                message: cg_id ? 'Contact Group updated successful' : 'New Contact Group added successful',
                data: resData
            }
        }).catch(errData => {
            message = message || 'Error while insert or update contact group';
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

// GET contact group data - POST METHOD
const getContactGroups = async (request, response, next) => {
    console.log('In getContactGroups(), request body isss:', request.body);

    let result = {};
    let inputOutputParams = [];
    let contactGroupsDataList = [];
    let contactGroupsDataCount = 0;
    let message = '';

    try {
        for (let item of Object.keys(request.body)) {
            if (item == 'search_by') {
                request.body[item] = JSON.stringify(request.body[item]);
            }
            inputOutputParams.push(request.body[item]);
        }

        console.log('Final inputOutputParams isss:', inputOutputParams);

        // ************************ GET contact groups list data ******************************************//
        await userSP.selectDataSP(spConfig.GET_CONTACT_GROUPS,inputOutputParams,null).then(async resData => {
            // console.log('Get Contact Groups list resData isss:', resData);

            contactGroupsDataList = resData;

        }).catch(errData => {
            message = message || 'Error while get contact groups list';
            throw errData;
        });

        // ************************ GET contact groups count data ******************************************//

        inputOutputParams[6] = true;

        await userSP.selectDataSP(spConfig.GET_CONTACT_GROUPS,inputOutputParams,null).then(async resData => {
            // console.log('Get Contact Groups count resData isss:', resData);

            contactGroupsDataCount = resData && resData.length ? resData.length : 0;

        }).catch(errData => {
            message = message || 'Error while get contact groups count';
            throw errData;
        });

        result = {
            success: true,
            error: false,
            statusCode: 200,
            message: 'Get Contact Groups list successful',
            data: {
                list: contactGroupsDataList,
                count: contactGroupsDataCount
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

// ADD or UPDATE contact sub group data - POST METHOD
const addOrUpdateContactSubGroup = async (request, response, next) => {
    console.log('In addOrUpdateContactSubGroup(), request body isss:', request.body);

    let result = {};
    let contactSubGroupData = [];
    let message = '';

    try {
        const {
            csg_id
        } = request.body;

        for (const item of Object.keys(request.body)) {
            contactSubGroupData.push(request.body[item]);
        }

        console.log('Final contactSubGroupData isss:', contactSubGroupData);

        await userSP.insertOrUpdateDataSP(spConfig.ADD_UPDATE_CONTACT_SUB_GROUP,contactSubGroupData,null).then(async resData => {
            console.log('Get addOrUpdate Contact Sub Group resData isss:', resData);

            result = {
                success: true,
                error: false,
                statusCode: 200,
                message: csg_id ? 'Contact Sub Group updated successful' : 'New Contact Sub Group added successful',
                data: resData
            }
        }).catch(errData => {
            message = message || 'Error while insert or update contact sub group';
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
    addOrUpdateContactSaveLocation,
    getContactSaveLocations,
    addOrUpdateContactGroup,
    getContactGroups,
    addOrUpdateContactSubGroup
}