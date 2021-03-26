const { access } = require('fs');
const connect = require('../database');
const tokenF = require('../token');

const userModels = {
  findUser: async (email) => {
    try {
      const conn = await connect();
      const emailCheckSql = `
         SELECT * FROM users where email = ?;
      `;
      const emailCheck = await conn.query(emailCheckSql, email);
      if (emailCheck[0].toString().length) {
        // 이미 존재하기 때문에 true 를 내보내줌
        return true;
      }
      return false;
    } catch (err) {
      return err;
    }
  },

  generalSignUp: async (userInfo) => {
    const conn = await connect();
    try {
      const { email, password, profileImage, userName, phoneNumber, birthday } = userInfo;

      const insertUserInfoSql = `
        INSERT INTO users SET email=?, password=?, profile_image=?, user_name=?, phone_number=?, birthday=?
      `;
      await conn.query(insertUserInfoSql, [
        email,
        password,
        profileImage,
        userName,
        phoneNumber,
        birthday,
      ]);
      return { message: 'Success' };
    } catch (err) {
      return { message: 'Fail' };
    }
  },

  loginUser: async (args) => {
    try {
      const conn = await connect();
      const loginSql = `
        SELECT * FROM users where email = ? and password = ?;
      `;
      const loginReq = await conn.query(loginSql, [args.email, args.password]);
      if (loginReq[0].toString().length) {
        const { email, user_name, phone_number, profile_image, birthday } = JSON.parse(
          JSON.stringify(loginReq[0])
        )[0];
        const accessToken = tokenF.createAccessToken({
          email,
          user_name,
          phone_number,
          profile_image,
          birthday,
        });
        return accessToken;
      }
      return false;
    } catch (err) {
      return err;
    }
  },

  userInfoCardandStack: async (email) => {
    try {
      const conn = await connect();
      const getCardSql = `
        SELECT * FROM info_cards where email = ?;
      `;
      const getStackSql = `
      select i.interests_name from interests i
      left join user_and_interests ui
      ON i.interests_code = ui.interests_code where ui.email = ?;
      `;
      const result = await conn.query(getCardSql + getStackSql, [email, email]);
      return result[0];
    } catch (err) {
      return err;
    }
  },
};

module.exports = userModels;
