import { Pool } from "mariadb";
import getConnection from "../structures/getConnection";
import { readdir, readFile } from "fs/promises";

export default async function initDb(): Promise<void> {
  const connection = getConnection()

  await deleteAllTables(connection);
  await createTables(connection);
}

async function createTables(connection: Pool): Promise<void> {
  const sqlFiles = await readdir('./data/sql');

  for (const sqlFile of sqlFiles) {
    const sql = await readFile(`./data/sql/${sqlFile}`)
    console.log(`Creating table: "${sqlFile}"`)
    await connection.query(sql.toString())
  }
}

async function deleteAllTables(connection: Pool): Promise<void> {
  const sql = 'SHOW TABLES';
  const tableResult = await connection.query(sql);

  for (const table of tableResult) {
    // The key with the table name is smth like "Tables_in_DB_NAME" so its prob different with other db names
    // So we "normalise" it to an array and take the first key
    const tableName = Object.values(table)[0]
    console.log(`Deleting table: "${tableName}"`)
    await connection.query(`DROP TABLE ${tableName};`)
  }
}
