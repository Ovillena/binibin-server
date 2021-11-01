module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    // redirect to correct log in screen when ready
    res.redirect("/api/sadness");
  },
  forwardAuthenicated: (req, res, next) => {
    if(!req.isAuthenticated()) {
      return next();
    }
  // Successful authentication will redirect to correct home
  res.redirect("/")
  }
};