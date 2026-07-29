/**
 * 
 * SQL QUERIES
 * 
    CREATE SEQUENCE company_id_seq
    START WITH 1001
    INCREMENT BY 1;

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        company_id INTEGER UNIQUE NOT NULL
            DEFAULT nextval('company_id_seq'),
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user'
    );

    CREATE TABLE equipment (
        id SERIAL PRIMARY KEY,
        equipment_name VARCHAR(100) NOT NULL,
        category VARCHAR(50),

        condition VARCHAR(20)
        CHECK (
            condition IN (
                'Excellent',
                'Good',
                'Fair',
                'Damaged'
            )
        ),

        status VARCHAR(20)
        DEFAULT 'Available'
        CHECK (
            status IN (
                'Available',
                'Borrowed',
                'Maintenance',
                'Retired'
            )
        ),

        borrowed_by INTEGER REFERENCES users(id),
        borrowed_at TIMESTAMP,
        returned_at TIMESTAMP
    );
 * 
 * 
 * 
 * 
 * 
 * 
 */