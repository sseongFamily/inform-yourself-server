const connect = require('../database');

module.exports = {
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
