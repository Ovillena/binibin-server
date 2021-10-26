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

app.use('/api', router);

app.listen(port, () => {
    console.log('Node application listening on port ' + port);
});
