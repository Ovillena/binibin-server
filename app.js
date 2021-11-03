const express = require('express');
const app = express();
const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const database = include('/models/databaseConnection');
const session = require('express-session');

// Testing ability to connect to db
database.connect((err, dbConnection) => {
    if (!err) {
        console.log('Successfully tested connection to PostgreSQL');
        dbConnection.release();
        console.log('Successfully disconnected test connection to PostgreSQL');
    } else {
        console.log('Error Connecting to PostgreSQL');
        console.log(err);
    }
});

// Body parser, reading data from body into req.body
app.use(express.json());

// configuring authentication
const passport = require('./middleware/passport');

app.use(
    session({
        secret: 'secretSauce1234!',
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
    console.log(`user details: ${JSON.stringify(req.user)}`);
    console.log(`session object: ${JSON.stringify(req.session)}`);
    console.log(
        `session details passport ${JSON.stringify(req.session.passport)}`
    );
    next();
});

//----------------------------------------------------------------

// Routers
const indexRouter = include('routes/index');
const usersRouter = include('routes/user');
const entriesRouter = include('routes/entry');

// Routes
app.use('/api/users', usersRouter);
app.use('/api/entries', entriesRouter);
app.use('/api', (req, res, next) => {
    res.send('binibin api');
});
app.use('/', indexRouter);

// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});

// Error handler
app.use(globalErrHandler);

module.exports = app;
