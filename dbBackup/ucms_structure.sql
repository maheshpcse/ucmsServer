-- ----------------- DATABASE STRUCTURE STARTS ---------------------
-- Adding Contact Details Fields
-- ---- First Table Name : contact_info
-- ---- Required Columns :
-- ci_id - INT(11), Primary Key, NOT NULL, Auto Increment
-- admin_id - INT(11), NOT NULL

-- fullname/displayname - VARCHAR(100), NOT NULL
-- firstname - VARCHAR(100), NULL
-- middlename - VARCHAR(100), NULL
-- lastname - VARCHAR(100), NULL
-- username/nickname - VARCHAR(50), NULL
-- prefix_name - VARCHAR(20), NULL

-- company - VARCHAR(100), NULL
-- title - VARCHAR(50), NULL

-- phone_info - JSON, NOT NULL - [{prefix: '+91', phone: '9876543210', label: 'phone'}]

-- email_info - JSON, NULL - [{email: 'testmaster123@gmail.com', label: 'custom'}]

-- address_info - JSON, NULL - [{address: 'Bengaluru', label: 'home'}]

-- im_info - JSON, NULL - [{IM: '', label: 'skype'}]

-- website_info - JSON, NULL - ['test.com', 'sample.com']

-- date_info - JSON, NULL - [{date: '01-01-2001', label: 'birthday'}]

-- notes - TEXT, NULL

-- profile_image - TEXT, NULL

-- status - TINYINT(1), NULL, 0-Inactive, 1-Active, 2-Blocked
-- created_by - VARCHAR(50), NOT NULL
-- created_at - DATE_TIME, NULL
-- updated_at - TIME_STAMP, NULL



-- ---- Second Table Name : contact_sub_info
-- ---- Required Columns :
-- csi_id - INT(11), Primary Key, NOT NULL, Auto Increment
-- contact_id - INT(11), NOT NULL
-- groups - JSON, NULL - [1,2,3,4]
-- csl_id - INT(11), NOT NULL - Phone,Jio SIM,Idea Sim,Email(Synced to Phone)

-- status - TINYINT(1), NULL, 0-Inactive, 1-Active, 2-Blocked
-- created_by - VARCHAR(50), NOT NULL
-- created_at - DATE_TIME, NULL
-- updated_at - TIME_STAMP, NULL



-- ---- Third Table Name : contact_save_locations
-- ---- Required Columns :
-- csl_id - INT(11), Primary Key, NOT NULL, Auto Increment
-- save_location - VARCHAR(100), NOT NULL
-- label - ENUM('Phone', 'Email', 'Sim'), NOT NULL - (Phone,Email,Sim)

-- status - TINYINT(1), NULL, 0-Inactive, 1-Active, 2-Blocked
-- created_by - VARCHAR(50), NOT NULL
-- created_at - DATE_TIME, NULL
-- updated_at - TIME_STAMP, NULL



-- ---- Third Table Name : contact_groups
-- ---- Required Columns :
-- cg_id - INT(11), Primary Key, NOT NULL, Auto Increment
-- main_group - VARCHAR(50), NOT NULL
-- group_info - TEXT, NULL

-- status - TINYINT(1), NULL, 0-Inactive, 1-Active, 2-Blocked
-- created_by - VARCHAR(50), NOT NULL
-- created_at - DATE_TIME, NULL
-- updated_at - TIME_STAMP, NULL



-- ---- Fourth Table Name : contact_sub_groups
-- ---- Required Columns :
-- csg_id - INT(11), Primary Key, NOT NULL, Auto Increment
-- cg_id - INT(11), NOT NULL
-- sub_group - VARCHAR(100), NOT NULL
-- group_info - TEXT, NULL

-- status - TINYINT(1), NULL, 0-Inactive, 1-Active, 2-Blocked
-- created_by - VARCHAR(50), NOT NULL
-- created_at - DATE_TIME, NULL
-- updated_at - TIME_STAMP, NULL


-- ----- Fifth Table Name : contact_groups_linking
-- ---- Required Columns :

-- ----------------- DATABASE STRUCTURE ENDS ---------------------

-- TODO: ucms database backup