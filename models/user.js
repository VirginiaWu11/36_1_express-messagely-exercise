/** User class for message.ly */
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");

/** User of the site. */

class User {
    /** register new user -- returns
     *    {username, password, first_name, last_name, phone}
     */

    static async register(username, password, first_name, last_name, phone) {
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const result = await db.query(
            `INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at)
        VALUES ($1,$2,$3,$4,$5, current_timestamp, current_timestamp)
        RETURNING username, password, first_name, last_name, phone`,
            [username, hashedPassword, first_name, last_name, phone]
        );
        return result.rows[0];
    }

    /** Authenticate: is this username/password valid? Returns boolean. */

    static async authenticate(username, password) {
        const results = await db.query(
            `SELECT username, password
        FROM users
        WHERE username = $1`,
            [username]
        );
        const user = results.rows[0];
        console.log(user, username, password);
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ username }, SECRET_KEY);
                return { message: `Logged in!`, token };
            }
        }
        throw new ExpressError("Invalid username/password", 400);
    }

    /** Update last_login_at for user */

    static async updateLoginTimestamp(username) {
        const result = await db.query(
            `UPDATE users
            SET last_login_at = current_timestamp
            WHERE username = $1
            RETURNING username`,
            [username]
        );

        if (!result.rows[0]) {
            throw new ExpressError(`No such user: ${username}`, 404);
        }
    }

    /** All: basic info on all users:
     * [{username, first_name, last_name, phone}, ...] */

    static async all() {
        let result = await db.query(
            "SELECT username, password, first_name, last_name, phone FROM users"
        );
        return result.rows;
    }

    /** Get: get user by username
     *
     * returns {username,
     *          first_name,
     *          last_name,
     *          phone,
     *          join_at,
     *          last_login_at } */

    static async get(username) {
        let result = await db.query(
            `SELECT username, password, first_name, last_name, phone FROM users WHERE username = $1`,
            [username]
        );
        return result.rows[0];
    }
    /** Return messages to this user.
     *
     * [{id, from_user, body, sent_at, read_at}]
     *
     * where from_user is
     *   {username, first_name, last_name, phone}
     */

    static async messagesTo(username) {
        let result = await db.query(
            `SELECT m.id, m.from_username, m.body, m.sent_at, m.read_at, u.first_name, u.last_name, u.phone 
            FROM messages AS m
            JOIN users AS u
            ON m.to_username = u.username
            WHERE to_username = $1`,
            [username]
        );
        return result.rows.map((val) => ({
            id: val.id,
            from_user: {
                username: val.from_username,
                first_name: val.first_name,
                last_name: val.last_name,
                phone: val.phone,
            },
            body: val.body,
            sent_at: val.sent_at,
            read_at: val.read_at,
        }));
    }

    /** Return messages from this user.
     *
     * [{id, to_user, body, sent_at, read_at}]
     *
     * where to_user is
     *   {username, first_name, last_name, phone}
     */

    static async messagesFrom(username) {
        let result = await db.query(
            `SELECT m.id, m.to_username, m.body, m.sent_at, m.read_at, u.first_name, u.last_name, u.phone 
            FROM messages AS m
            JOIN users AS u
            ON m.from_username = u.username
            WHERE from_username = $1`,
            [username]
        );
        return result.rows.map((val) => ({
            id: val.id,
            from_user: {
                username: val.to_username,
                first_name: val.first_name,
                last_name: val.last_name,
                phone: val.phone,
            },
            body: val.body,
            sent_at: val.sent_at,
            read_at: val.read_at,
        }));
    }
}

module.exports = User;
