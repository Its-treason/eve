import { createPool, Pool } from 'mariadb';
let connection: Pool;

export default function getConnection(): Pool {
  if (connection !== undefined) {
    return connection;
  }

  connection = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
  });
  return connection;
}
