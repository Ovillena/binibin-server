const router = require('express').Router();
const { ensureAuthenticated } = require('../middleware/checkAuth');

const passport = require('../middleware/passport');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log('------- is there an error ----------');
            return next(err);
        }
        if (!user) {
            return res.json({ message: 'user not found', error: err });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            console.log('--------------login return json ------------');
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

router.get('/checkauth', ensureAuthenticated, (req, res) => {
    res.json({ 'logged in': true });
    res.json({
        account_id: req.user.rows[0].account_id,
        username: req.user.rows[0].username,
        email: req.user.rows[0].email,
        school_id: req.user.rows[0].school_id,
        admin_account_id: req.user.rows[0].admin_account_id,
        display_name: req.user.rows[0].display_name,
        is_admin: req.user.rows[0].is_admin,
    });
});

router.get('/logout', (req, res) => {
    req.logout();
});

module.exports = router;
