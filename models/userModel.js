const database = include('/models/databaseConnection');
const passwordPepper = 'SeCretPeppa4MySal+';
const crypto = require('crypto');

const userModel = {
    findOne: async (username) => {
        console.log('called findOne');
        // need to update this if we change database for user account id

        let sqlQuery = 'SELECT * FROM admin_accounts WHERE username = $1';
        let values = [username];
        let user = await database
            .query(sqlQuery, values)
            .then((user) => user)
            .catch((err) => console.log(err));
        return user;
    },
    findById: async (id) => {
        console.log(`called findById with param id: ${id}`);
        // need to update this if we change database for user account id
        let sqlQuery = `SELECT * FROM admin_accounts WHERE admin_account_id = $1`;
        let values = [id];
        let user = await database
            .query(sqlQuery, values)
            .then((user) => user)
            .catch((err) => console.log(err));
        return user ? user : null;
    },

    //   const getAllAdminInfo = (callback) => {
    //     let sqlQuery =
    //         'SELECT username, password FROM admin_accounts';
    //     database.query(sqlQuery, (err, results, fields) => {
    //         if (err) {
    //             callback(err, null);
    //         } else {
    //             console.log(results);
    //             callback(null, results);
    //         }
    //     });
    // };

    hashPassword: (password, salt) => {
        const password_hash = crypto.createHash('sha512');
        password_hash.update(password + passwordPepper + salt);
        return password_hash.digest('hex');
    },
};

module.exports = { userModel };
