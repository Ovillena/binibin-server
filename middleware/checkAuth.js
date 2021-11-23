module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        // redirect to correct log in screen when route is ready

        // res.redirect('/auth/login');
        res.json({"logged in": false})
    },
    forwardAuthenicated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        // Successful authentication will redirect to correct home
        res.redirect('/');
    },
};
