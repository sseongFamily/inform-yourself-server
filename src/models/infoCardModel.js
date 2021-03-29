const connect = require('../database');

const infoCardModels = {
  infoCardTotalList: async () => {
    const conn = await connect();
    try {
      const infoCardTotalListSql = `
      SELECT u.user_name, u.profile_image, info.one_line_introduce, GROUP_CONCAT(i.interests_name SEPARATOR " ") AS stack From users AS u
      INNER JOIN info_cards AS info
      ON u.email = info.email
      INNER JOIN user_and_interests AS uai
      ON u.email = uai.email
      INNER JOIN interests AS i
      ON uai.interests_code = i.interests_code
      GROUP BY u.user_name, u.profile_image, info.one_line_introduce;
      `;
      const totalList = await conn.query(infoCardTotalListSql);

      for (let list of totalList[0]) {
        list.stack = list.stack.split(' ');
      }
      return totalList[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};

module.exports = infoCardModels;
