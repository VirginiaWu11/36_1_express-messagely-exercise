/** User class for message.ly */
const db = require("../db");

/** User of the site. */

class User {
    /** register new user -- returns
     *    {username, password, first_name, last_name, phone}
     */

    static async register({
        username,
        password,
        first_name,
        last_name,
        phone,
    }) {}

    /** Authenticate: is this username/password valid? Returns boolean. */

    static async authenticate(username, password) {}

    /** Update last_login_at for user */

    static async updateLoginTimestamp(username) {}

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
            "SELECT id, from_username, body, sent_at, read_at FROM messages WHERE to_username = $1",
            [username]
        );
        return result.rows;
    }

    /** Return messages from this user.
     *
     * [{id, to_user, body, sent_at, read_at}]
     *
     * where to_user is
     *   {username, first_name, last_name, phone}
     */

    static async messagesFrom(username) {}
}

module.exports = User;
