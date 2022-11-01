const { Model } = require('objection');

class Contact_groups extends Model {
    static get tableName() {
        return 'contact_groups';
    }

    static get idColumn() {
        return 'cg_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                cg_id: { type: ['integer', null] },                 // Primary Key Id (Auto increment)
                main_group: { type: ['string'] },
                group_info: { type: ['string', 'text', null] },
                status: { type: ['integer', 'number', null] },      // 0-Inactive, 1-Active, 2-Blocked. Default: 1
                created_by: { type: 'string' },                     // Admin Site Loggedin User
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Contact_groups;