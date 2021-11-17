const router = require('express').Router();
const database = include('./models/databaseConnection');
const entryController = require('../controllers/entryController');

router.get('/', (req, res) => {
    console.log('page hit');
    database.connect(function (err, dbConnection) {
        if (err) {
            res.status(401).send({ message: 'Error connecting to Postgres' });
            console.log('Error connecting to PostgreSQL');
            console.log(err);
        } else {
            entryController.getAllEntries((err, result) => {
                if (err) {
                    res.send('Error reading from PostgreSQL');
                    console.log(
                        'Error reading getAllEntries() from PostgreSQL'
                    );
                    console.log(err);
                } else {
                    //success
                    res.status(200).json(result.rows);
                    //Output the results of the query to the Heroku Logs
                    console.log(result.rows);
                }
            });
            dbConnection.release();
        }
    });
});
router.get('/:accountId', (req, res) => {
    console.log('page hit');
    database.connect(function (err, dbConnection) {
        if (err) {
            res.status(401).send({ message: 'Error connecting to Postgres' });
            console.log('Error connecting to PostgreSQL');
            console.log(err);
        } else {
            entryController.getAllEntriesById(req, (err, result) => {
                if (err) {
                    res.send('Error reading from PostgreSQL');
                    console.log(
                        'Error reading getAllEntries() from PostgreSQL'
                    );
                    console.log(err);
                } else {
                    //success
                    res.status(200).json(result.rows);
                    //Output the results of the query to the Heroku Logs
                    console.log(result.rows);
                }
            });
            dbConnection.release();
        }
    });
});
router.get('/items', (req, res) => {
    console.log('@grab items');
    database.connect(function (err, dbConnection) {
        if (err) {
            res.status(401).send({ message: 'Error connecting to Postgres' });
            console.log('Error connecting to PostgreSQL');
            console.log(err);
        } else {
            entryController.getAllItems((err, result) => {
                if (err) {
                    res.send('Error reading from PostgreSQL');
                    console.log('Error reading from PostgreSQL');
                    console.log(err);
                } else {
                    console.log('_______________________ITMES!!!! ROOUTE');
                    //success
                    res.json(result.rows);

                    //Output the results of the query to the Heroku Logs
                    console.log(result.rows);
                }
            });
            dbConnection.release();
        }
    });
});
router.get('/:startDate/:endDate', (req, res) => {
    console.log('page hit');
    database.connect(function (err, dbConnection) {
        if (err) {
            res.status(401).send({ message: 'Error connecting to Postgres' });
            console.log('Error connecting to PostgreSQL');
            console.log(err);
        } else {
            entryController.getEntriesByDateRange(req, (err, result) => {
                if (err) {
                    res.send('Error reading from PostgreSQL');
                    console.log('Error reading from PostgreSQL');
                    console.log(err);
                } else {
                    console.log('_______________________ENTRY ROOUTE');
                    //success
                    res.json(result.rows);

                    //Output the results of the query to the Heroku Logs
                    console.log(result.rows);
                }
            });
            dbConnection.release();
        }
    });
});

router.get('/:wasteType/:startDate/:endDate', (req, res) => {
    console.log('page hit');
    database.connect(function (err, dbConnection) {
        if (err) {
            res.status(401).send({ message: 'Error connecting to Postgres' });
            console.log('Error connecting to PostgreSQL');
            console.log(err);
        } else {
            entryController.getEntriesByDateRangeAndType(req, (err, result) => {
                if (err) {
                    res.send('Error reading from PostgreSQL');
                    console.log('Error reading from PostgreSQL');
                    console.log(err);
                } else {
                    console.log('_______________________ENTRY ROOUTE');
                    //success
                    res.json(result.rows);

                    //Output the results of the query to the Heroku Logs
                    console.log(result.rows);
                }
            });
            dbConnection.release();
        }
    });
});

router.post('/add', (req, res) => {
    console.log('json data submitted');
    database.connect((err, client, done) => {
        if (err) {
            res.status(401).send({ message: 'Error connecting to Postgres' });
            console.log('Error connecting to Postgres');
            console.log(err);
        } else {
            console.log(req.body);
            entryController.addEntry(req.body, (err, result) => {
                if (err) {
                    res.status(401).send({
                        message: 'Error writing to Postgres',
                    });
                    console.log('Error writing to Postgres');
                    console.log(err);
                } else {
                    //success
                    res.status(201).json({
                        status: 'Entry successfully added',
                    });
                    //Output the results of the query to the Heroku Logs
                    console.log(result.rows);
                }
            });
        }
    });
});

module.exports = router;
