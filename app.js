const express = require('express');

const app = express();
const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// Body parser, reading data from body into req.body
app.use(express.json());

// Routes
const indexRouter = include('routes/index');
const usersRouter = include('routes/user');
app.use('/api/users', usersRouter);
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
