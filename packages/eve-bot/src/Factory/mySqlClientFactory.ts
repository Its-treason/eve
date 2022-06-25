import MySQLClient from '../Structures/MySQLClient';

export default function mySqlClientFactory(): MySQLClient {
  if (
    !process.env.DB_HOST ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_DATABASE
  ) {
    throw new Error('Not all MySQL Environment variables have been set');
  }

  return new MySQLClient(
    process.env.DB_HOST,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_DATABASE,
  );
}
