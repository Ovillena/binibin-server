
const passport = require("../middleware/passport");

const router = express.Router();

router.post("/login", 
  passport.authenticate("local", {
    failureRedirect: '/auth/login',
    failureFlash: true,
  }), 
  function (req, res) {
    // res.redirect("/");
    res.send("I LOVE YOU.")
  }
)

module.exports = router;
