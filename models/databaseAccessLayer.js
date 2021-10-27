const database = include('/databaseConnection');

const getAllAdminUsers = (callback) => {
    let sqlQuery =
        'SELECT admin_account_id, username, email FROM admin_accounts';
    database.query(sqlQuery, (err, results, fields) => {
        if (err) {
            callback(err, null);
        } else {
            console.log(results);
            callback(null, results);
        }
    });
};

const getAdminUserById = (postData, callback) => {
    let sqlQuery = 'SELECT * FROM admin_accounts WHERE id = :id';
    let params = {
        id: postData.id,
    };
    database.query(sqlQuery, params, (err, result) => {
        if (err) {
            callback(err, null);
        }
        console.log(results);
        callback(null, result);
    });
};

const passwordPepper = 'SeCretPeppa4MySal+';
const addUser = (postData, callback) => {
    let sqlInsertSalt =
        'INSERT INTO users (first_name, last_name, email, password_salt)VALUES (:first_name, :last_name, :email, sha2(UUID(),512));';
    let params = {
        first_name: postData.first_name,
        last_name: postData.last_name,
        email: postData.email,
    };
    console.log(sqlInsertSalt);
    database.query(sqlInsertSalt, params, (err, results, fields) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            let insertedID = results.insertId;
            let updatePasswordHash =
                'UPDATE users SET password_hash = sha2(concat(:password,:pepper,password_salt),512) WHERE web_user_id = :userId;';
            let params2 = {
                password: postData.password,
                pepper: passwordPepper,
                userId: insertedID,
            };
            console.log(updatePasswordHash);
            database.query(
                updatePasswordHash,
                params2,
                (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        console.log(results);
                        callback(null, results);
                    }
                }
            );
        }
    });
};

const updateUser = (postData, callback) => {
    let sqlUpdateUser =
        'UPDATE users SET first_name = :first_name, last_name = :last_name, email = :email WHERE id = :id';
    let params = {
        id: postData.id,
        first_name: postData.first_name,
        last_name: postData.last_name,
        email: postData.email,
    };
    database.query(sqlUpdateUser, params, (err, result) => {
        if (err) {
            callback(err, null);
        }
        callback(null, result);
    });
};

const deleteUser = (webUserId, callback) => {
    let sqlDeleteUser = 'DELETE FROM users WHERE web_user_id = :userID';
    let params = { userID: webUserId };
    console.log(sqlDeleteUser);
    database.query(sqlDeleteUser, params, (err, results, fields) => {
        if (err) {
            callback(err, null);
        } else {
            console.log(results);
            callback(null, results);
        }
    });
};

module.exports = {
    getAllAdminUsers,
    getAdminUserById,
    addUser,
    updateUser,
    deleteUser,
};
