BEGIN TRANSACTION;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email text UNIQUE NOT NULL,
    entries BIGINT DEFAULT 0,
    joined TIMESTAMP NOT NULL,
    pet text  NOT NULL,
    age BIGINT DEFAULT 0
);

COMMIT;