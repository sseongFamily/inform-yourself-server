const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const userRouter = require('./routes/userRouter');
const infoCardRouter = require('./routes/infoCardRouter');

// 각 분기에 대한 route 처리
app.use('/user', userRouter);
app.use('/infocard', infoCardRouter);

app.get('/', (req, res) => {
  res.send('Inform Yourself Server');
});

app.listen(4000, () => {
  console.log('server start on', 4000);
});
