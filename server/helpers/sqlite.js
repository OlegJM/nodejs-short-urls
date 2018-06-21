const path = require('path');
const sqlite = require('sqlite3').verbose();
const config = require('../config').db;

const dbQueries = {
  insertUrl: `INSERT INTO ${config.tableName} (${config.fieldName}) VALUES ($longUrl);`,
  selectUrl: `SELECT ${config.fieldName} FROM ${config.tableName} WHERE _id = $id LIMIT 1;`,
  selectId: `SELECT _id FROM ${config.tableName} WHERE ${config.fieldName} = $longUrl LIMIT 1;`,
  createTable: `CREATE TABLE IF NOT EXISTS ${config.tableName} (
        _id INTEGER PRIMARY KEY AUTOINCREMENT,
        ${config.fieldName} text UNIQUE NOT NULL
      );`,
  createIndex: `CREATE UNIQUE INDEX IF NOT EXISTS idx_long_url ON ${config.tableName} (${config.fieldName});`,
  dropTable: `DROP TABLE IF EXISTS ${config.tableName};`,
  getLast5Rows: `SELECT * FROM ${config.tableName} 
        LIMIT 5 OFFSET (SELECT COUNT(*) 
        FROM ${config.tableName})-10 ORDER BY DESC;`,
  getLastRows: `SELECT * FROM ${config.tableName} ORDER BY _id DESC LIMIT 5;`,
  getRows: `SELECT * FROM ${config.tableName};`
};

const dbMethods = {
  get: 'get',
  all: 'all',
  run: 'run'
};

const db = new sqlite.Database(path.resolve(__dirname, config.path), (error) => {
  if (error) {
    return console.error(error.message);
  }
  console.log('Connected to the SQlite database.');
});

db.asyncAction = function (method, sql, params = []) {
  return new Promise((resolve, reject) => {
    this[method](sql, params, (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
};

async function createTable() {
  await db.asyncAction(dbMethods.run, dbQueries.createTable);
  await db.asyncAction(dbMethods.run, dbQueries.createIndex);
}

async function getLinkId(link) {
  try {
    const row = await db.asyncAction(dbMethods.get, dbQueries.selectId, { $longUrl: link });
    return row._id;
  } catch (error) {
    console.log(JSON.stringify(error));
  }
}

async function getLink(linkId) {
  try {
    const row = await db.asyncAction(dbMethods.get, dbQueries.selectUrl, { $id: linkId });
    return row.long_url;
  } catch (error) {
    console.log(JSON.stringify(error));
  }
}

async function insertLink(link) {
  try {
    await db.asyncAction(dbMethods.run, dbQueries.insertUrl, { $longUrl: link });
  } catch (error) {
    console.log(JSON.stringify(error));
  }
}

async function getLastLinks() {
  try {
    return await db.asyncAction(dbMethods.all, dbQueries.getLastRows, []);
  } catch (error) {
    console.log(JSON.stringify(error));
  }
}

async function insertLongLink(link) {
  let linkId = await getLinkId(link);

  if (!linkId) {
    await createTable();
    await insertLink(link);
    linkId = await getLinkId(link);
  }

  let rows = await getLastLinks();
  return { linkId, rows };
}

module.exports = {
  insertLongLink,
  getLink
};
