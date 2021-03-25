const { createPool } = require('mysql2/promise');


async function connect() {

const connect = async () => {

  const connection = await createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });
  return connection;
  }
};


module.exports = connect;
