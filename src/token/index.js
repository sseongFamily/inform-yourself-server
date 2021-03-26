const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

const tokenFunction = {
  createAccessToken: (userInfo) => {
    const accessToken = jwt.sign(userInfo, ACCESS_SECRET, { expiresIn: '2 h' });
    return accessToken;
  },
  verifyAccessToken: (accessToken) => {
    const userInfo = jwt.verify(accessToken, ACCESS_SECRET);
    return userInfo;
  },
};

module.exports = tokenFunction;
