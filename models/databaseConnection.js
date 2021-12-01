const { Pool } = require('pg');

require('dotenv').config();

const is_heroku = process.env.IS_HEROKU || true;

// const pgPool = new Pool({
//     host: 'localhost',
//     user: 'postgres',
//     port: 5432,
//     password: process.env.PG_PWD,
//     database: 'playground',
// });



if (is_heroku) {
    const pgHerokuPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    var database = pgHerokuPool;
} else {
    // var database = pgPool;
    var database = pgHerokuPool;
}

module.exports = database;
