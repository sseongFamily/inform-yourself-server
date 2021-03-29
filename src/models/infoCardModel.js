const connect = require('../database');

const infoCardModles = {
  create: async (cardInfo) => {
    try {
      // TODO : 카드에 정보 입력 해주기
      const conn = await connect();
      const insertSql = `
        INSERT INTO info_cards 
        (email, title, one_line_introduce, description, blog_url, repository_url)
        values (?, ?, ?, ?, ?, ?);
      `;

      await conn.query(insertSql, [
        cardInfo.email,
        cardInfo.title,
        cardInfo.oneLineIntroduce,
        cardInfo.description,
        cardInfo.blogUrl,
        cardInfo.repositoryUrl,
      ]);

      await Promise.all(
        cardInfo.stack.map(async (el) => {
          const getInterestCode = `SELECT interests_code from interests where lower(interests_name) = lower(?);`;
          const insertUserInt = `
            INSERT INTO user_and_interests(email, interests_code) values(?, ?);
          `;
          const result = await conn.query(getInterestCode, el);
          if (result[0][0] === undefined) {
            const insertSql = `INSERT INTO interests(interests_name) values (?);`;
            const result = await conn.query(insertSql, el);
            return await conn.query(insertUserInt, [cardInfo.email, result[0].insertId]);
          }
          await conn.query(insertUserInt, [cardInfo.email, result[0][0].interests_code]);
        })
      );

      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};

module.exports = infoCardModles;
