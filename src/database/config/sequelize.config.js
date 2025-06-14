const {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  DB_SCHEMA,
} = require("../../config/environment.config");

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    schema: DB_SCHEMA,
    logging: false,
    pool: {
      max: 50,
      min: 0,
      acquire: 10000,
      idle: 10000,
    },
  },
};
