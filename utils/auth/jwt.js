// utils/auth/jwt.js
const jwt = require('jsonwebtoken');

exports.signToken = (userId) => {
    return jwt.sign({ id: userId }, "MyLittlesecret", {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
};
