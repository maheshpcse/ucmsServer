const { Model } = require('objection');

class Contact_save_locations extends Model {
    static get tableName() {
        return 'contact_save_locations';
    }

    static get idColumn() {
        return 'csl_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                csl_id: { type: ['integer', null] },                // Primary Key Id (Auto increment)
                save_location: { type: ['string'] },                // Contact Saved Location Name
                label: { type: ['string'] },                        // Phone,Email,Sim
                status: { type: ['integer', 'number', null] },      // 0-Inactive, 1-Active, 2-Blocked. Default: 1
                created_by: { type: 'string' },                     // Admin Site Loggedin User
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Contact_save_locations;