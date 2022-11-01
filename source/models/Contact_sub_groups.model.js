const { Model } = require('objection');

class Contact_sub_groups extends Model {
    static get tableName() {
        return 'contact_sub_groups';
    }

    static get idColumn() {
        return 'csg_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                csg_id: { type: ['integer', null] },                // Primary Key Id (Auto increment)
                cg_id: { type: ['integer'] },                       // Primary Key Id from `contact_groups` table
                sub_group: { type: ['string'] },
                group_info: { type: ['string', 'text', null] },
                status: { type: ['integer', 'number', null] },      // 0-Inactive, 1-Active, 2-Blocked. Default: 1
                created_by: { type: 'string' },                     // Admin Site Loggedin User
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Contact_sub_groups;