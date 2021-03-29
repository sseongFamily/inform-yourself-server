const infoCardModel = require('../models/infoCardModel');
const tokenF = require('../token');

const infoCardModule = {
  createCard: async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
      const { email } = tokenF.verifyAccessToken(accessToken);
      req.body.email = email;
      const result = await infoCardModles.create(req.body);
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
};

module.exports = infoCardModule;
