DROP TABLE IF EXISTS pastes

CREATE TABLE pastes(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    body VARCHAR(255)
)