const crypto = require('crypto');

const userModel = require('../models/userModel');

const userModule = {
  signup: async (req, res) => {
    // TODO: client로 부터 회원가입 시 필요한 정보를 req.body로 받는다.
    const { password } = req.body;
    const hasPw = await crypto
      .pbkdf2Sync(
        password,
        String(process.env.CRYPTO_SALT),
        Number(process.env.CRYPTO_ITERATOR),
        32,
        String(process.env.CRYPTO_ALGORITHM)
      )
      .toString('hex');
    // TODO: req.body의 password를 변환 된 password로 변경한다.
    req.body.password = hasPw;

    // TODO: userModel로 정보를 넘긴다.
    const result = await userModel.generalSignUp(req.body);
    res.send(result);
  },
};

module.exports = userModule;
