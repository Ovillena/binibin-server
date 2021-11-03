const express = require('express');

const app = express();
const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// Body parser, reading data from body into req.body
app.use(express.json());
// maybe bodyParser isn't required?
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// i think this is sessions
const session = require("express-session");
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

// passport stuff
const passport = require("./middleware/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(`user details: ${req.user}`);
    console.log(`session object: ${req.session}`);
    console.log(`session details passport ${req.session.passport}`);
    next();
})

// Routes
const indexRouter = include('routes/index');
const usersRouter = include('routes/user');
const authRouter = include('routes/auth')
app.use('/api/users', usersRouter);
app.use('/auth', authRouter);
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
