const database = include("./databaseConnection")
const passwordPepper = 'SeCretPeppa4MySal+';
const crypto = require("crypto");

const userModel = {
  findOne: async(email) => {
    let sqlQuery = 'SELECT * FROM admin_accounts WHERE email = :email';
    let params = {
        email: email,
    };
    database.query(sqlQuery, params, (err, result) => {
        if (err) {
            callback(err, null);
        }
        console.log(results);
        callback(null, result.rows);
    });
  },

  hashPassword: (password, salt) => {
    const password_hash = crypto.createHash("sha512");
    password_hash.update(password + passwordPepper + salt);
    return password_hash.digest("hex");
  },
}

module.exports = { userModel };