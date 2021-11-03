const router = require('express').Router();
const { ensureAuthenticated } = require("../middleware/checkAuth")

const passport = require("../middleware/passport");


router.get('/sadness', (req, res) => {
  res.send("sadness. try again")
})

router.get('/login', (req, res) => {
  res.send("At login page. Post username and password to login.")
})
router.post("/login",
  passport.authenticate("local", {
    failureRedirect: '/auth/sadness',
  }), (req, res) => {
    // res.redirect("/");
    res.redirect('/auth/hiddenpage')
  }
)
router.get("/hiddenpage", ensureAuthenticated, (req, res) => {
  res.send("At hidden page for logged in users only. You are logged in")
})
router.get("/logout", (req, res) => {
  req.logout();
  res.send("you logged out")
})

module.exports = router;