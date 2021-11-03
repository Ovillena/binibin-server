const passport = require('../middleware/passport');

const router = express.Router();

router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/auth/login',
        failureFlash: true,
    }),
    function (req, res) {
        // res.redirect("/");
        res.send('I LOVE YOU.');
    }
);

// Auth testing leftovers
// router.post(
//     '/login',
//     passport.authenticate('local', {
//         failureRedirect: '/api/sadness',
//     }),
//     (req, res) => {
//         // res.redirect("/");
//         res.send('love me today');
//     }
// );
// router.get('/hiddenpage', ensureAuthenticated, (req, res) => {
//     res.send('passed check. you are logged in');
// });
// router.get('/logout', (req, res) => {
//     req.logout();
//     res.send('you logged out');
// });

module.exports = router;
