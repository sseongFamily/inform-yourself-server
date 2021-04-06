const infoCardModel = require('../models/infoCardModel');
const tokenF = require('../token');

const infoCardModule = {
  createCard: async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
      const { email } = tokenF.verifyAccessToken(accessToken);
      req.body.email = email;
      console.log(req.body);
      await infoCardModel.create(req.body);
      return res.json({ message: '성공적으로 등록되었습니다.' });
    } catch (err) {
      return res.send(err);
    }
  },

  totalList: async (req, res) => {
    try {
      const list = await infoCardModel.infoCardTotalList();
      res.send(list);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  detailList: async (req, res) => {
    try {
      // TODO: params로 넘어온 id의 값은 각 infoCard의 primary key
      const { id } = req.query;
      const list = await infoCardModel.infoCardDetailList(id);
      res.send(list);
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  },
  removeInfoCard: async (req, res) => {
    const { infoCardId } = req.body;
    try {
      await infoCardModel.removeCard(infoCardId);
    } catch (err) {
      return res.send(err);
    }
  },

  modifyCard: async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
      const { email } = tokenF.verifyAccessToken(accessToken);
      req.body.email = email;
      await infoCardModel.modify(req.body);
      return res.json({ message: '정보수정 완료되었습니다.' });
    } catch (err) {
      return err;
    }
  },

  clickLikeOrUnLike: async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
      const { email } = tokenF.verifyAccessToken(accessToken);
      req.body.email = email;
      const result = await infoCardModel.likeOrUnLike(req.body);
      res.send(result);
    } catch (err) {
      return err;
    }
  },
};

module.exports = infoCardModule;
