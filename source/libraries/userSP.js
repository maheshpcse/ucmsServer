require('dotenv').config();
const Promise = require('bluebird');
const { objection } = require('objection');
const Knexx = require('../config/knex.js');
const dbConfig = require('../config/dbConfig.js');

// SELECT/READ data Stored Procedure
const selectDataSP = function (spName, inputParams, outputParams) {
    return new Promise((resolve, reject) => {
        let finalSP = `CALL ${spName}(${generateInputs(inputParams.length)})`;

        // let mod = Knexx.knex.transaction(trx => {
        //     return Knexx.knex.raw(finalSP, inputParams);
        // });
        // mod.then(result => {
        //     result = result && result.length && result[0].length ? result[0][0] : [];
        //     resolve(result);
        // }).catch(error => {
        //     reject(error);
        // });

        // with mysql connection
        dbConfig.connection.query(finalSP, inputParams, (error, results, fields) => {
            if (error) {
                reject(error);
            }
            results = results && results.length && results[0] ? results[0] : [];
            resolve(results);
        });
    });
}

function generateInputs(num) {
    let array = [];
    for (let i = 0; i < num; i++) {
        array.push('?');
    }
    return array.join();
}

module.exports = {
    selectDataSP
}