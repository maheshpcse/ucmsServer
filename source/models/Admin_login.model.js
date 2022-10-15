const { Model } = require('objection');

class Admin_login extends Model {
    static get tableName() {
        return 'admin_login';
    }

    static get idColumn() {
        return 'admin_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                admin_id: { type: ['integer', null] },                // Primary Key Id (Auto increment)
                user_info_id: { type: ['integer', null] },
                adminLoginName: { type: ['string', null] },
                password: { type: ['string', 'text', null] },
                lastLogin: { type: ['string', null] },
                status: { type: ['integer', 'number', null] },      // 0-Inactive, 1-Active, 2-Blocked. Default: 1
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Admin_login;