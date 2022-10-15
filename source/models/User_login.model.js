const { Model } = require('objection');

class User_login extends Model {
    static get tableName() {
        return 'user_login';
    }

    static get idColumn() {
        return 'user_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                user_id: { type: ['integer', null] },
                user_info_id: { type: ['integer', null] },
                userLoginName: { type: ['string', null] },
                password: { type: ['string', 'text', null] },
                lastLogin: { type: ['string', null] },
                status: { type: ['integer', 'number', null] },      // 0-Inactive, 1-Active, 2-Blocked. Default: 1
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = User_login;