const { Model } = require('objection');

class Contact_info extends Model {
    static get tableName() {
        return 'contact_info';
    }

    static get idColumn() {
        return 'ci_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                ci_id: { type: ['integer', null] },                // Primary Key Id (Auto increment)
                admin_id: { type: ['integer'] },                   // Primary Key Id from `admin_login` table
                displayname: { type: ['string'] },
                firstname: { type: ['string', null] },
                middlename: { type: ['string', null] },
                lastname: { type: ['string', null] },
                nickname: { type: ['string', null] },
                prefix_name: { type: ['string', null] },
                company: { type: ['string', null] },                // Company Name
                title: { type: ['string', null] },                  // Company Title
                phone_info: { type: ['string', 'json', null] },     // Prefix,PhoneNumber,Label
                email_info: { type: ['string', 'json', null] },     // Email,Label
                address_info: { type: ['string', 'json', null] },   // Address,Label
                im_info: { type: ['string', 'json', null] },        // IM,Label
                website_info: { type: ['string', 'json', null] },   // Website Name
                date_info: { type: ['string', 'json', null] },      // Date,Label
                notes: { type: ['string', 'text', null] },          // Bio or About
                profile_image: { type: ['string', 'text', null] },  // Contact Profile Pic
                status: { type: ['integer', 'number', null] },      // 0-Inactive, 1-Active, 2-Blocked. Default: 1
                created_by: { type: 'string' },                     // Admin Site Logged In Username
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Contact_info;