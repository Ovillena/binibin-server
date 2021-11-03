const passport = require("passport");
const LocalStrategy = require("passport-local");
const userController = require("../controllers/userController");


const localLogin = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async (username, password, done) => {
    console.log(`at passport locallogin`);
    const user = await userController.getUserByUsernameAndPassword(
      username,
      password
    );
    console.log(`at localLogin seeing what ${JSON.stringify(user)} is`)
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Username or password is invalid. Please try again :)",
        });
  }
);

passport.serializeUser(async function (user, done) {
  console.log("useeerrrrrrrrrrrrrrrr serial " + JSON.stringify(user.account_id));
  // returning user ID only
  done(null, user.account_id);
});

passport.deserializeUser(async function (id, done) {
  let user = await userController.getUserById(id);
  console.log(`checking out deserialize user = ${JSON.stringify(user)}, and the passed in id = ${id}`)
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin);