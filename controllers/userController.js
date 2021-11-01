const userModel = require("../models/userModel").userModel;
const database = include("/databaseConnection");

const getUserByUsernameAndPassword = async (username, password) => {
  let user = await userModel.findOne(username);
  console.log("getUserByUsernameAndPassword --- user: " + user);
  if (user) {
    console.log(`at getUserByUsername. found ${JSON.stringify(user.rows)}`)
    if (await isUserValid(user.rows, password)) {
      console.log(`calling isUserValid from getUserByUsernameAndPassword`)
      // return only the useful stuff that i see, which is rows
      return user.rows[0];
    }
  }
  return null;
};

const getUserById = (id) => {
  let user = userModel.findById(id);
  return user ? user : null;
}

function isUserValid(user, password) {
  console.log(`at isUserValid checking if ${user[0]["password"]} is the same as ${password}`)
  // const passHash = userModel.hashPassword(password, user.password_salt);
  return user[0]["password"] === password;
};

module.exports = {
  getUserByUsernameAndPassword,
  isUserValid,
  getUserById
}