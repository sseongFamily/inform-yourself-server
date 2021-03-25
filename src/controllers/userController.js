const crypto = require('crypto');
const userModel = require('../models/userModel');

module.exports = {
  lgoin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const hasPw = await crypto
        .pbkdf2Sync(
          password,
          String(process.env.CRYPTO_SALT),
          Number(process.env.CRYPTO_ITERATOR),
          32,
          String(process.env.CRYPTO_ALGORITHM)
        )
        .toString('hex');
      const emailCheck = await userModel.findUser(email);
      if (!emailCheck) {
        return res.status(409).json({ message: '존재하지 않는 아이디 입니다.' });
      }
      const loginReq = await userModel.loginUser({ email: email, password: hasPw });
      if (!loginReq) {
        return res.status(409).json({ message: '비밀번호가 틀렸습니다.' });
      }
      res.json({ message: '로그인 성공' });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
};
