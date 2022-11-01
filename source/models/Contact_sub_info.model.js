const { Model } = require('objection');

class Contact_sub_info extends Model {
    static get tableName() {
        return 'contact_sub_info';
    }

    static get idColumn() {
        return 'csi_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                csi_id: { type: ['integer', null] },                // Primary Key Id (Auto increment)
                contact_id: { type: ['integer'] },                  // Primary Key Id from `contact_info` table
                groups: { type: ['string', 'json', null] },         // Primary Key Ids array from `contact_sub_groups` table
                location_id: { type: ['integer'] },                 // Primary Key Id from `contact_saved_locations` table
                status: { type: ['integer', 'number', null] },      // 0-Inactive, 1-Active, 2-Blocked. Default: 1
                created_by: { type: 'string' },                     // Admin Site Loggedin User
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Contact_sub_info;