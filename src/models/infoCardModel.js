const connect = require('../database');

const infoCardModel = {
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
      return err;
    }
  },
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

  modify: async (modifyInfo) => {
    const conn = await connect();
    try {
      const modifySql = `
        UPDATE info_cards SET 
        title = ?,
        one_line_introduce = ?, 
        description = ?, 
        blog_url =?, 
        repository_url =? 
        WHERE email = ?;
      `;
      await conn.query(modifySql, [
        modifyInfo.title,
        modifyInfo.oneLineIntroduce,
        modifyInfo.description,
        modifyInfo.blogUrl,
        modifyInfo.repositoryUrl,
        modifyInfo.email,
      ]);
      const resetInterests = `
        DELETE from user_and_interests where email = ?
      `;
      await conn.query(resetInterests, modifyInfo.email);

      await Promise.all(
        modifyInfo.stack.map(async (el) => {
          const getInterestCode = `SELECT interests_code from interests where lower(interests_name) = lower(?);`;
          const insertUserInt = `
            INSERT INTO user_and_interests(email, interests_code) values(?, ?);
          `;
          const result = await conn.query(getInterestCode, el);
          if (result[0][0] === undefined) {
            const insertSql = `INSERT INTO interests(interests_name) values (?);`;
            const result = await conn.query(insertSql, el);
            return await conn.query(insertUserInt, [modifyInfo.email, result[0].insertId]);
          }
          await conn.query(insertUserInt, [modifyInfo.email, result[0][0].interests_code]);
        })
      );
    } catch (err) {
      return err;
    }
  },

  removeCard: async (infoCardId) => {
    const conn = await connect();

    try {
      const removeCardSql = `
      UPDATE info_cards SET is_delete = 1 WHERE info_cards_id = ?;
      `;
      await conn.query(removeCardSql, [infoCardId]);
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  likeOrUnLike: async (args) => {
    const conn = await connect();

    try {
      const findLikeOrUnLikeUserSql = `
      SELECT * FROM users_like_info_cards WHERE email = ? AND info_cards_id = ?
      `;
      const checkLikeOrUnLike = await conn.query(findLikeOrUnLikeUserSql, [
        args.email,
        args.infoCardsId,
      ]);

      //? 만약 특정 유저가 특정 게시글에 대한 좋아요를 눌렀다면
      if (checkLikeOrUnLike[0].length > 0) {
        // TODO : users_like_info_cards 테이블에 값 삭제, 해당 게시글에 like_count를 감소
        const removeLikeInfoSql = `
        DELETE FROM users_like_info_cards WHERE email = ? AND info_cards_id = ?;
        `;
        await conn.query(removeLikeInfoSql, [args.email, args.infoCardsId]);

        const decrementLikeCountSql = `
        UPDATE info_cards SET like_count = like_count - 1 WHERE info_cards_id = ?;
        `;
        await conn.query(decrementLikeCountSql, args.infoCardsId);
      } else {
        //? : 특정 유저가 특정 게시글에 대한 좋아요를 누르지 않았다면
        // TODO : users_like_info_cards 테이블에 값 추가, 해당 게시글에 like_count를 증가

        const insertLikeInfoSql = `
        INSERT INTO users_like_info_cards SET email = ?, info_cards_id = ?;
        `;
        await conn.query(insertLikeInfoSql, [args.email, args.infoCardsId]);

        const incrementLikeCountSql = `
        UPDATE info_cards SET like_count = like_count + 1 WHERE info_cards_id = ?;
        `;
        await conn.query(incrementLikeCountSql, args.infoCardsId);
      }

      return { message: 'Success' };
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};

module.exports = infoCardModel;
