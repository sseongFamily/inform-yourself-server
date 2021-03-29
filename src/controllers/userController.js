const crypto = require('crypto');
const userModel = require('../models/userModel');
const tokenF = require('../token');

const userModule = {
  login: async (req, res) => {
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
      res.json({ message: '로그인 성공', accessToken: loginReq });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

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
    res.status(200).send(result);
  },
  list: async (req, res) => {
    const result = await userModel.hotAndNewUerInfo();
    res.status(200).send(result);
  },

  info: async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
      const userInfo = tokenF.verifyAccessToken(accessToken);
      delete userInfo.iat;
      delete userInfo.exp;
      const userCard = await userModel.userInfoCardandStack(userInfo.email);
      userCard[0][0].stack = [];
      userCard[1].map((el) => userCard[0][0].stack.push(el.interests_name));
      res.json({
        userInfo,
        userCard: userCard[0],
      });
    } catch (err) {
      return err;
    }
  },

  withdraw: async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
      const { email } = tokenF.verifyAccessToken(accessToken);
      await userModel.withdrawUser(email);
      res.json({ message: '회원탈퇴 성공' });
    } catch (err) {
      res.send(err);
    }
  },
};
module.exports = userModule;
