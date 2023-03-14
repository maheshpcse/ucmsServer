const { Model } = require('objection');

class Admin_settings_login extends Model {
    static get tableName() {
        return 'admin_settings_login';
    }

    static get idColumn() {
        return 'settings_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                settings_id: { type: ['integer', null] },                // Primary Key Id (Auto increment)
                user_info_id: { type: ['integer', null] },
                settingsLoginName: { type: ['string', null] },
                password: { type: ['string', 'text', null] },
                loginStatus: { type: ['integer', 'number', null] },   // 0 - Loggedout, 1 - Loggedin, Default: 0
                lastLogin: { type: ['string', null] },
                status: { type: ['integer', 'number', null] },      // 0-Inactive, 1-Active, 2-Blocked. Default: 1
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Admin_settings_login;