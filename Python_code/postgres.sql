-- DDL's in sequence
-- create a ENUM status_type to contain only 2 values. This will be used in the mfcodes table
CREATE TYPE status_enum AS ENUM ('ACTIVE', 'SUSPENDED');

-- DDL to create the mfcodes table
CREATE TABLE IF NOT EXISTS mfcodes (
    schemecode Integer PRIMARY Key,
    fundhouse VARCHAR(150),
    schemename VARCHAR(250) NOT NULL,
    schemetype VARCHAR(150),
    schemecategory VARCHAR(150),
    latestnavdate DATE,
    schemestartdate DATE,
    latestnav NUMERIC(13, 5),
    status  status_enum
);
--if needed drop the table
DROP table mfcodes
