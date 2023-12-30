const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.USERNAME}:${process.env.PASSWORD}@${
      process.env.HOST
    }:${process.env.DBPORT}/${
      process.env.NODE_ENV === "test" ? "todoapp_test_db" : "todoapp_db"
    }`,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

module.exports = pool;
