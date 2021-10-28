const router = require('express').Router();
const database = include('databaseConnection');
const dbModel = include('databaseAccessLayer');

const passport = require("../middleware/passport");

router.get('/sadness', (req, res) => {
    res.send("try again")
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
  }),

  function (req, res) {
    // res.redirect("/");
    res.send("I LOVE YOU.")
  }
)

// app.post('/login', function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//         if (err) { return next(err); }
//         if (!user) { return res.redirect('/api/sadness'); }
    
//     // NEED TO CALL req.login()!!!
//         req.login(user, next);
//     })(req, res, next);
// });
module.exports = router;
