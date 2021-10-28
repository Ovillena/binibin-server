const passport = require("passport");
const LocalStrategy = require("passport-local");
const userController = require("../controllers/userController");


const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    console.log(`at passport locallogin`);
    const user = await userController.getUserByEmailIdAndPassword(
      email,
      password
    );
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Email or password is invalid. Please try again :)",
        });
  }
);

// passport.serializeUser(async function (user, done) {
//   console.log("useeerrrrrrrrrrrrrrrr serial " + user);
//   done(null, user.id);
// });

// passport.deserializeUser(async function (id, done) {
//   let user = await userController.getUserById(id);
//   if (user) {
//     done(null, user);
//   } else {
//     done({ message: "User not found" }, null);
//   }
// });

module.exports = passport.use(localLogin);