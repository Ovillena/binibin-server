const users = require('./user');
// recyclables? items?
const items = require('./items');

module.exports = (app) => {
    app.use('/users', users);
    app.use('/items', items);
    // etc..
};
