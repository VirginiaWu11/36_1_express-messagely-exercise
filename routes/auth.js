const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const ExpressError = require("../expressError");
const User = require("../models/user");
const { BCRYPT_WORK_FACTOR } = require("../config");

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
        const message = await User.authenticate(username, password);
        return res.json(message);
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
router.get("/register", async (req, res, next) => {
    try {
        const { username, password, first_name, last_name, phone } = req.body;
        if (!username || !password || !first_name || !last_name || !phone) {
            throw new ExpressError("Username and password required", 400);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        console.log(hashedPassword);
        const user = await User.register(
            username,
            password,
            first_name,
            last_name,
            phone
        );
        // User.updateLoginTimestamp(username);
        return res.json(user);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
