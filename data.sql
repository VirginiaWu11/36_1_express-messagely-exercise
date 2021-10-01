\c messagely

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);

INSERT INTO users
  (username, password, first_name, last_name, phone, join_at, last_login_at)
    VALUES ('JJ', 'password', 'Juanita', 'admin', '111-222-3333', '2021-09-30T23:01:42.102Z','2021-09-30T23:01:42.102Z');

INSERT INTO users
  (username, password, first_name, last_name, phone, join_at, last_login_at)
    VALUES ('KK', 'password', 'Hello', 'admin', '111-222-3333', '2021-09-30T23:01:42.102Z','2021-09-30T23:01:42.102Z');

INSERT INTO users
  (username, password, first_name, last_name, phone, join_at, last_login_at)
    VALUES ('BB', 'password', 'Bloop', 'Bleep', '111-222-3333', '2021-09-30T23:01:42.102Z','2021-09-30T23:01:42.102Z');

INSERT INTO messages 
    (from_username, to_username, body, sent_at, read_at)
    VALUES ('JJ', 'BB', 'hey', '2021-09-30T23:02:33.102Z', '2021-09-30T23:02:35.102Z');

INSERT INTO messages 
    (from_username, to_username, body, sent_at, read_at)
    VALUES ('JJ', 'BB', 'hi', '2021-09-30T23:02:34.102Z', '2021-09-30T23:02:35.102Z');

INSERT INTO messages 
    (from_username, to_username, body, sent_at, read_at)
    VALUES ('JJ', 'BB', 'u there?', '2021-09-30T23:02:33.102Z', '2021-09-30T23:02:35.102Z');

INSERT INTO messages 
    (from_username, to_username, body, sent_at, read_at)
    VALUES ('KK', 'BB', 'Been trying to reach you', '2021-09-30T23:02:33.102Z', '2021-09-30T23:02:35.102Z');