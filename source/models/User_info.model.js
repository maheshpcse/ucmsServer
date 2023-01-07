const { Model } = require('objection');

class User_info extends Model {
    static get tableName() {
        return 'user_info';
    }

    static get idColumn() {
        return 'user_info_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                user_info_id: { type: ['integer', null] },
                fullname: { type: ['string', null] },
                username: { type: ['string', null] },
                email: { type: ['string', null] },
                mobile: { type: ['string', null] },
                address: { type: ['string', 'text', null] },
                city: { type: ['string', null] },
                state: { type: ['string', null] },
                country: { type: ['string', null] },
                zipcode: { type: ['string', null] },
                profile: { type: ['string', 'json', null] },
                role: { type: ['string', null] },                   // admin, user. Default: user
                status: { type: ['integer', 'number', null] },      // 0-Inactive, 1-Active, 2-Blocked. Default: 1
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = User_info;