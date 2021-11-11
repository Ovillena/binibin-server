const router = require('express').Router();
const { ensureAuthenticated } = require('../middleware/checkAuth');

const passport = require('../middleware/passport');

router.get('/sadness', (req, res) => {
    res.send('sadness. try again');
});

router.get('/login', (req, res) => {
    res.send('At login page. Post username and password to login.');
});

// router.post(
//     '/login',
//     passport.authenticate('local', {
//         // failureRedirect: '/auth/sadness',
//         failureRedirect: { username: '' },
//     }),
//     (req, res) => {
//         // res.redirect("/");
//         // res.redirect('/auth/hiddenpage');
//         res.json({ username: req.user });
//     }
// );

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({ message: 'user not found', error: err });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.json({
                account_id: user.account_id,
                username: user.username,
                email: user.email,
                school_id: user.school_id,
                admin_account_id: user.admin_account_id,
                display_name: user.display_name,
                is_admin: user.is_admin,
            });
        });
    })(req, res, next);
});

router.get('/hiddenpage', ensureAuthenticated, (req, res) => {
    res.send('At hidden page for logged in users only. You are logged in');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send('you logged out');
});

module.exports = router;
