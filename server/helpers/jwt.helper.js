const jwt = require('jsonwebtoken');
const User = require('../apis/user/user.model');
const config = require('../../config');

function decodeToken(token) {
    return jwt.decode(token.replace('Bearer ', ''));
}

async function getAuthUser(token) {
    try {
        const tokenData = decodeToken(token);
        // console.log('tokeData', tokenData.id);
        const user = await User.findById(tokenData.id);
        return user;
    } catch (e) {
        return null;
    }
}

//JWT token sign
function getJWTToken(data) {
    const token = `Bearer ${jwt.sign(data, config.tokenSecret)}`;
    return token;
}

module.exports = { decodeToken, getJWTToken, getAuthUser };
