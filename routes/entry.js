const router = require('express').Router();
const database = include('./models/databaseConnection');
const entryController = require('../controllers/entryController');

const jwt = require('../jwt');

router.get('/', jwt.authorize, (req, res) => {
    console.log('get all entries', req.user);
    entryController.getAllEntries(req.user.account_id, (err, result) => {
        if (err) {
            res.send('Error reading from PostgreSQL');
            console.log('Error reading getAllEntries() from PostgreSQL', err);
        } else {
            //success
            res.status(200).json(result.rows);
            //Output the results of the query to the Heroku Logs
            console.log('getAllEntries results:', result.rows);
        }
    });
    // database.connect(function (err, dbConnection) {
    //     if (err) {
    //         res.status(401).send({ message: 'Error connecting to Postgres' });
    //         console.log('Error connecting to PostgreSQL', err);
    //     } else {

    //         dbConnection.release();
    //     }
    // });
});
router.get('/:accountId', (req, res) => {
    entryController.getAllEntriesById(req, (err, result) => {
        if (err) {
            res.send('Error reading from PostgreSQL');
            console.log('Error reading getAllEntries() from PostgreSQL', err);
        } else {
            //success
            res.status(200).json(result.rows);
            //Output the results of the query to the Heroku Logs
            console.log('getAllEntriesById results:', result.rows);
        }
    });
    // database.connect(function (err, dbConnection) {
    //     if (err) {
    //         res.status(401).send({ message: 'Error connecting to Postgres' });
    //         console.log('Error connecting to PostgreSQL');
    //         console.log(err);
    //     } else {

    //         dbConnection.release();
    //     }
    // });
});
// router.get('/items', (req, res) => {
//     entryController.getAllItems((err, result) => {
//         if (err) {
//             res.send('Error reading from PostgreSQL');
//             console.log('Error reading from PostgreSQL', err);
//         } else {
//             //success
//             res.json(result.rows);

//             //Output the results of the query to the Heroku Logs
//             console.log('getAllItems', result.rows);
//         }
//     });
//     // database.connect(function (err, dbConnection) {
//     //     if (err) {
//     //         res.status(401).send({ message: 'Error connecting to Postgres' });
//     //         console.log('Error connecting to PostgreSQL');
//     //         console.log(err);
//     //     } else {

//     //         dbConnection.release();
//     //     }
//     // });
// });
router.get('/:startDate/:endDate', jwt.authorize, (req, res) => {
    entryController.getEntriesByDateRange(req, (err, result) => {
        if (err) {
            res.send('Error reading from PostgreSQL');
            console.log('Error reading from PostgreSQL', err);
        } else {
            //success
            res.json(result.rows);

            //Output the results of the query to the Heroku Logs
            console.log('getEntriesByDateRange', result.rows);
        }
    });
    // database.connect(function (err, dbConnection) {
    //     if (err) {
    //         res.status(401).send({ message: 'Error connecting to Postgres' });
    //         console.log('Error connecting to PostgreSQL');
    //         console.log(err);
    //     } else {

    //         dbConnection.release();
    //     }
    // });
});

router.get('/:wasteType/:startDate/:endDate', jwt.authorize, (req, res) => {
    console.log('user is logged in', req.user);

    entryController.getEntriesByDateRangeAndType(req, (err, result) => {
        if (err) {
            res.send('Error reading from PostgreSQL');
            console.log('Error reading from PostgreSQL', err);
        } else {
            //success
            res.json(result.rows);

            //Output the results of the query to the Heroku Logs
            // console.log('getEntriesByDateRangeAndType', result.rows);
            console.log(
                'getEntriesByDateRangeAndType',
                req.params.startDate,
                req.params.endDate
            );
        }
    });
    // database.connect(function (err, dbConnection) {
    //     if (err) {
    //         res.status(401).send({ message: 'Error connecting to Postgres' });
    //         console.log('Error connecting to PostgreSQL');
    //         console.log(err);
    //     } else {

    //         dbConnection.release();
    //     }
    // });
});

//get all entires for the month for each waste type
router.get(
    '/:wasteType/:startDate/:endDate/month',
    jwt.authorize,
    (req, res) => {
        console.log('user is logged in', req.user);

        entryController.getEntriesByMonthRangeAndType(req, (err, result) => {
            if (err) {
                res.send('Error reading from PostgreSQL');
                console.log('Error reading from PostgreSQL', err);
            } else {
                //success
                res.json(result.rows);

                //Output the results of the query to the Heroku Logs
                // console.log('getEntriesByDateRangeAndType', result.rows);
                console.log(
                    'getEntriesByMonthRangeAndType',
                    req.params.startDate,
                    req.params.endDate
                );
            }
        });
    }
);

router.post('/add', jwt.authorize, (req, res) => {
    entryController.addEntry(
        req.body.data,
        req.user.account_id,
        (err, result) => {
            if (err) {
                res.status(401).send({
                    message: 'Error writing to Postgres',
                });
                console.log('Error writing to Postgres', err);
            } else {
                //success
                res.status(201).json({
                    status: 'Entry successfully added',
                });
                //Output the results of the query to the Heroku Logs
                console.log('addEntry', result.rows);
            }
        }
    );
    // database.connect((err, dbConnection) => {
    //     if (err) {
    //         res.status(401).send({ message: 'Error connecting to Postgres' });
    //         console.log('Error connecting to Postgres', err);
    //     } else {
    //         console.log(
    //             '-------add route------',
    //             req,
    //             '-------add route------'
    //         );

    //         dbConnection.release();
    //     }
    // });
});

module.exports = router;
