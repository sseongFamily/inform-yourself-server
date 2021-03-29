const connect = require('../database');

const infoCardModels = {
  infoCardTotalList: async () => {
    const conn = await connect();
    try {
      const infoCardTotalListSql = `
      SELECT u.user_name, u.profile_image, info.one_line_introduce, GROUP_CONCAT(i.interests_name SEPARATOR ", ") AS stact, info.created_at From users AS u
      INNER JOIN info_cards AS info
      ON u.email = info.email
      INNER JOIN user_and_interests AS uai
      ON u.email = uai.email
      INNER JOIN interests AS i
      ON uai.interests_code = i.interests_code
      GROUP BY u.user_name, u.profile_image, info.one_line_introduce, info.created_at
      ORDER BY info.created_at;
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
  infoCardDetailList: async (id) => {
    const conn = await connect();
    try {
      const infoCardDetailListSql = `
      SELECT u.user_name, u.profile_image, info.one_line_introduce, info.title, info.description, info.blog_url, info.repository_url, info.like_count, info.created_at, GROUP_CONCAT(i.interests_name SEPARATOR ", ") AS stack FROM users AS u
      INNER JOIN info_cards AS info
      ON u.email = info.email
      INNER JOIN user_and_interests AS uai
      ON u.email = uai.email
      INNER JOIN interests AS i
      ON uai.interests_code = i.interests_code
      WHERE info.info_cards_id = ?
      GROUP BY u.user_name, u.profile_image, info.one_line_introduce, info.title, info.description, info.blog_url, info.repository_url, info.like_count, info.created_at
      ORDER BY info.created_at;
      `;
      const detailList = await conn.query(infoCardDetailListSql, id);

      for (let list of detailList[0]) {
        list.stack = list.stack.split(' ');
      }

      return detailList[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};

module.exports = infoCardModels;