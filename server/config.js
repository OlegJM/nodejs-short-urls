const config = {
  server: {
    hostname: 'pc507',
    port: 3005
  },
  db: {
    path: '../db/short-urls.db',
    dbName: 'urls',
    tableName: 'long_url',
    fieldName: 'long_url'
  }
};

module.exports = config;
