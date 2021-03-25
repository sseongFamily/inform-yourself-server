const { createPool } = require('mysql2/promise');

export default async function connect() {
  const connection = await createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: procces.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });
  return connection;
}
