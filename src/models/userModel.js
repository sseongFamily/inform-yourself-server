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
        SELECT * FROM users where email = ? and password = ? and is_delete = 0;
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
  hotAndNewUerInfo: async () => {
    try {
      const conn = await connect();
      // TODO: newUser 정보 가져오기(stack추가 후 내보내기)
      // TODO: newUser 정보에서 like_count 기준으로 정렬(stack추가 후 내보내기)
      // newUser 정보 가져오기
      const newUserInfoSql = `
      SELECT u.email, u.user_name, u.profile_image, info.one_line_introduce, u.created_at,info.like_count
      FROM users AS u
      INNER JOIN info_cards AS info
      ON u.email = info.email
      ORDER BY created_at DESC;
      `;
      const newUserInfo = await conn.query(newUserInfoSql);

      const userStackSql = `
      SELECT u.email, i.interests_name
      FROM users AS u
      INNER JOIN user_and_interests AS uai
      ON u.email = uai.email
      INNER JOIN interests AS i
      ON i.interests_code = uai.interests_code;
      `;

      const userStack = await conn.query(userStackSql);

      newUserInfo[0].forEach((info) => {
        userStack[0].forEach((stack) => {
          if (info.email === stack.email) {
            if (info.stack === undefined) {
              info.stack = [stack.interests_name];
            } else {
              info.stack.push(stack.interests_name);
            }
          }
          return info;
        });
      });

      const newUser = [...newUserInfo[0]];
      const hotUser = newUserInfo[0].sort((a, b) => (a.like_count - b.like_count) * -1);

      // TODO: [hotUserInfo, newUserInfo] 내보내기
      return [{ newUser, hotUser }];
    } catch (err) {
      console.log(err);
      return 'Fail';
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

  withdrawUser: async (email) => {
    try {
      const conn = await connect();
      const withdrawSql = `
        UPDATE users SET is_delete = 1  where email = ?;
      `;
      await conn.query(withdrawSql, email);
    } catch (err) {
      return err;
    }
  },
};

module.exports = userModels;
