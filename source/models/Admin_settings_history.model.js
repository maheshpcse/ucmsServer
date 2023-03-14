const { Model } = require('objection');

class Admin_settings_history extends Model {
    static get tableName() {
        return 'admin_settings_history';
    }

    static get idColumn() {
        return 'setting_log_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                setting_log_id: { type: ['integer', null] },                // Primary Key Id (Auto increment)
                admin_id: { type: ['integer', null] },                      // Primary Key Id from admin_login table
                setting_name: { type: ['string', null] },
                setting_detail: { type: ['string', 'text', null] },
                request_info: { type: ['string', null] },
                log_time: { type: ['string', null] },
                response_time: { type: ['string', null] },
                status: { type: ['integer', 'number', null] },      // 0-Inactive, 1-Active, 2-Blocked. Default: 1
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Admin_settings_history;