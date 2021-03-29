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
};

module.exports = infoCardcontroller;
