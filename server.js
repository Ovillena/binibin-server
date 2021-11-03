//Define the include function for absolute file name
global.base_dir = __dirname;
global.abs_path = function (path) {
    return base_dir + path;
};
global.include = function (file) {
    return require(abs_path('/' + file));
};

const express = require('express');
const database = include('databaseConnection');
const router = include('routes/router');
const session = require("express-session");
const bodyParser = require('body-parser');


const port = process.env.PORT || 3000;

database.connect((err, dbConnection) => {
    if (!err) {
        console.log('Successfully connected to PostgreSQL');
    } else {
        console.log('Error Connecting to PostgreSQL');
        console.log(err);
    }
});

const app = express();
const passport = require("./middleware/passport");
app.use(bodyParser.json());

app.use(
    session({
      secret: "secretSauce1234!",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(`user details: ${req.user}`);
    console.log(`session object: ${req.session}`);
    console.log(`session details passport ${req.session.passport}`);
    next();
})

app.use('/api', router);
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err);
    process.exit(1);
});

const app = require('./app');

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});
