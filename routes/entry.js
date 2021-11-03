const router = require('express').Router();
const { ensureAuthenticated } = require('../middleware/checkAuth');
const database = include('./models/databaseConnection');
const entryController = require('../controllers/entryController');

const passport = require('../middleware/passport');

router.get('/sadness', (req, res) => {
    res.send('sadness; try again');
});

router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/api/sadness',
    }),
    (req, res) => {
        // res.redirect("/");
        res.send('love me today');
    }
);
router.get('/hiddenpage', ensureAuthenticated, (req, res) => {
    res.send('passed check. you are logged in');
});
router.get('/logout', (req, res) => {
    req.logout();
    res.send('you logged out');
});

router.get('/', (req, res) => {
    console.log('page hit');
    database.connect(function (err, dbConnection) {
        if (err) {
            res.send('Error connecting to PostgreSQL');
            console.log('Error connecting to PostgreSQL');
            console.log(err);
        } else {
            entryController.getAllEntries((err, result) => {
                if (err) {
                    res.send('Error reading from PostgreSQL');
                    console.log('Error reading from PostgreSQL');
                    console.log(err);
                } else {
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

module.exports = router;
