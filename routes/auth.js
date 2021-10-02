const express = require("express");
const router = new express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.get("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new ExpressError("Username and password required", 400);
        }
        const results = await db.query(
            `SELECT username, password
            FROM users
            WHERE username = $1`,
            [username]
        );
        const user = results.rows[0];
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ username }, SECRET_KEY);
                return res.json({ message: `Logged in!`, token });
            }
        }
        throw new ExpressError("Invalid username/password", 400);
    } catch (e) {
        next(e);
    }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

module.exports = router;
