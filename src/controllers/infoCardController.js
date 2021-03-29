const infoCardModel = require('../models/infoCardModel');

const infoCardcontroller = {
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
      return err;
    }
  },
};

module.exports = infoCardcontroller;
