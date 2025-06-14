require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_SCHEMA: process.env.DB_SCHEMA,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
  PAYROLL_CUTOFF_DAY_OFFSET: process.env.PAYROLL_CUTOFF_DAY_OFFSET,
  PAYROLL_CUTOFF_HOUR: process.env.PAYROLL_CUTOFF_HOUR,
};
