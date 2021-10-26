const { Pool } = require("pg");

require("dotenv").config();

const is_heroku = process.env.IS_HEROKU || false;

const pgPool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: process.env.PG_PWD,
  database: "playground",
});

const pgHerokuPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

if (is_heroku) {
  var database = pgHerokuPool;
} else {
  var database = pgPool;
}

module.exports = database;
