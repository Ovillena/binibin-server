const express = require('express');
const app = express();
const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const database = include('/models/databaseConnection');
// const router = include('routes/router');
const session = require('express-session');
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

const passport = require('./middleware/passport');
app.use(bodyParser.json());

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

// app.use('/api', router);

//----------------------------------------------------------------

// Body parser, reading data from body into req.body
app.use(express.json());

// Routes
const indexRouter = include('routes/index');
const usersRouter = include('routes/user');
app.use('/api/users', usersRouter);
const entriesRouter = include('routes/entry');
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

app.use(globalErrHandler);

module.exports = app;
