const userModel = require("../models/userModel").userModel;
const database = include("/databaseConnection");

const getUserByEmailIdAndPassword = async (email, password) => {
  let user = await userModel.findOne(email);
  console.log("getUserByEmailIdAndPassword --- user: " + JSON.stringify(user));
  if (user) {
    console.log(`at getuserbyemail. found ${user}`)
    if (await isUserValid(user, password)) {
      console.log(`checking if user is valid`)
      return user;
    }
  }
  return null;
};

function isUserValid(user, password) {
  const passHash = userModel.hashPassword(password, user.password_salt);
  // return user.password_hash === passHash;
  return true;
};

module.exports = {
  getUserByEmailIdAndPassword,
  isUserValid
}