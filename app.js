const express = require('express');

const app = express();
const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const database = include('/models/databaseConnection');
// const session = require('express-session');
const session = require('cookie-session');

const cors = require('cors');

app.set('trust proxy', 1);

app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'https://binibinapp.vercel.app',
            'https://binibin-client.herokuapp.com',
            'http://binibin-client.herokuapp.com',
        ],
        optionsSuccessStatus: 200,
        exposedHeaders: ['set-cookie'],
        credentials: true,
    })
);

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'https://binibin.vercel.app');
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     res.setHeader(
//         'Access-Control-Allow-Methods',
//         'GET, POST, OPTIONS, PUT, PATCH, DELETE'
//     );
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'X-Requested-With,content-type'
//     );
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     next();
// });

// Testing ability to connect to db
database.connect((err, dbConnection) => {
    if (!err) {
        console.log('Successfully tested connection to PostgreSQL');
        dbConnection.release();
        console.log('Successfully disconnected test connection to PostgreSQL');
    } else {
        console.log('Error Connecting to PostgreSQL', err);
    }
});

// Body parser, reading data from body into req.body
app.use(express.json());

// i think this is sessions
app.use(
    session({
        secret: 'secretSauce1234!',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'none',
        },
    })
);

// passport stuff
const passport = require('./middleware/passport');
app.use(passport.initialize());
// app.use(passport.session());

app.use((req, res, next) => {
    console.log(`user details: ${JSON.stringify(req.user)}`);
    console.log(`session object: ${JSON.stringify(req.session)}`);
    console.log(
        `session details passport ${JSON.stringify(req.session.passport)}`
    );
    next();
});

// Routes
const indexRouter = include('routes/index');
const usersRouter = include('routes/user');
const authRouter = include('routes/auth');
const entriesRouter = include('routes/entry');

// Routes
app.use('/auth', authRouter);
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
