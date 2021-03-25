const connect = require('../database');

const userModels = {
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
};

module.exports = userModels;
