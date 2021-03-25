const connect = require('../database');

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
    console.log(args);
    try {
      const conn = await connect();
      const loginSql = `
        SELECT * FROM users where email = ? and password = ?;
      `;
      const loginReq = await conn.query(loginSql, [args.email, args.password]);
      if (loginReq[0].toString().length) {
        return true;
      }
      return false;
    } catch (err) {
      return err;
    }
  },
};

module.exports = userModels;
