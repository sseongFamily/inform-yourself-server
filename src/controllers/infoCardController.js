const infoCardModles = require('../models/infoCardModel');
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
};

module.exports = infoCardModule;
