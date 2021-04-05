const crypto = require('crypto');
const tokenF = require('../token');
const userModel = require('../models/userModel');

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
      return res.json({ message: '로그인 성공', accessToken: loginReq });
    } catch (err) {
      console.log(err);
      return res.send(err);
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

      //? 특정 유저의 카드가 없는 경우도 있다 !!
      if (userCard[1].toString() === '') {
        return res.json({ userInfo, userCard: [] });
      }
      console.log('@@@1번째', userCard);
      userCard[0][0].stack = [];
      console.log('@@@2번째', userCard);
      userCard[1].map((el) => userCard[0][0].stack.push(el.interests_name));
      console.log(userCard);
      res.json({
        userInfo,
        userCard: userCard[0],
      });
    } catch (err) {
      return err;
    }
  },
  modify: async (req, res) => {
    // TODO : client로부터 accessToken을 받아 user_email을 조회
    const accessToken = req.headers.authorization.split(' ')[1];
    const { password } = req.body;
    try {
      const userInfo = tokenF.verifyAccessToken(accessToken);

      // TODO: password를 변경할 경우, 변경하지 않을 경우를 생각해야 했다.
      if (password !== undefined) {
        const hasPw = await crypto
          .pbkdf2Sync(
            password,
            String(process.env.CRYPTO_SALT),
            Number(process.env.CRYPTO_ITERATOR),
            32,
            String(process.env.CRYPTO_ALGORITHM)
          )
          .toString('hex');
        req.body.password = hasPw;
      }

      delete userInfo.iat;
      delete userInfo.exp;

      const modifyUserInfo = Object.assign(userInfo, req.body);

      // TODO : userModel.js에 user_email 데이터를 전송
      const newAcessToken = await userModel.userInfoModify(modifyUserInfo);

      res.send(newAcessToken);
    } catch (err) {
      res.send(err);
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
