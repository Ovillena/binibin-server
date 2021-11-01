const router = require('express').Router();
const database = include('databaseConnection');
const dbModel = include('databaseAccessLayer');
const { ensureAuthenticated } = require("../middleware/checkAuth")

const passport = require("../middleware/passport");

router.get('/sadness', (req, res) => {
    res.send("sadness; try again")
})

router.get('/', (req, res) => {
    console.log('page hit');
    database.connect(function (err, dbConnection) {
        if (err) {
            res.send('Error connecting to PostgreSQL');
            console.log('Error connecting to PostgreSQL');
            console.log(err);
        } else {
            dbModel.getAllAdminInfo((err, result) => {
                if (err) {
                    res.send('Error reading from PostgreSQL');
                    console.log('Error reading from PostgreSQL');
                    console.log(err);
                } else {
                    //success
                    res.json(result);

                    //Output the results of the query to the Heroku Logs
                    console.log(result.rows);
                }
            });
            dbConnection.release();
        }
    });
});
router.post("/login", 
  passport.authenticate("local", {
    failureRedirect: '/api/sadness',
  }), (req, res) => {
    // res.redirect("/");
    res.send("love me today")
  }
)
router.get("/hiddenpage", ensureAuthenticated, (req, res) => {
    res.send("passed check. you are logged in")
})
router.get("/logout", (req, res) => {
    req.logout();
    res.send("you logged out")
})


module.exports = router;
