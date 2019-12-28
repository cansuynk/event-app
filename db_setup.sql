CREATE TABLE users (
    username TEXT PRIMARY KEY,
    hash TEXT,
    phone_number TEXT,
    email TEXT
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    host TEXT REFERENCES users (username) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT NOT NULL
);


CREATE TABLE contacts (
    owner TEXT  REFERENCES users (username) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    PRIMARY KEY (owner, name)
);


CREATE TABLE participants (
    event_id INT REFERENCES events (event_id) ON DELETE CASCADE,
    guest TEXT, 
    status TEXT DEFAULT 'awaiting' NOT NULL
);