const db = include('models/databaseConnection');

// GET ROUTE: api/entries
const getAllEntries = (callback) => {
    let sqlQuery = 'SELECT entry_id, item_name, item_count, unit, waste_type,EXTRACT (MONTH FROM date) AS month, EXTRACT (DAY FROM date) AS DAY  FROM entries_demo';
    db.query(sqlQuery, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// GET ROUTE: api/entries/:startDate/:endDate
const getEntriesByDateRange = (postData, callback) => {
    let sqlQuery = `SELECT entry_id, item_name, item_count, unit, waste_type, TO_CHAR(date, 'dd/mm/yyyy') AS entry_date FROM entries_demo WHERE date BETWEEN :startDate AND :endDate`;
    let params = {
        startDate: postData.startDate,
        endDate: postData.endDate,
    };
    db.query(sqlQuery, params, (err, result) => {
        if (err) {
            callback(err, null);
        }
        console.log(results);
        callback(null, result);
    });
};

// POST ROUTE: api/entries/add
const addEntry = (postData, callback) => {
    const { item_name, item_count, unit, waste_type } = postData;
    let sqlQuery =
        'INSERT INTO entries_demo (item_name, item_count, unit, waste_type) VALUES ($1, $2, $3, $4)';
    if (item_name && item_count && unit && waste_type) {
        db.query(
            sqlQuery,
            [item_name, item_count, unit, waste_type],
            (err, result) => {
                if (err) {
                    callback(err, null);
                }
                callback(null, result);
            }
        );
    } else {
        callback('missing data', null);
    }
};

// const getAdminUserById = (postData, callback) => {
//     let sqlQuery = 'SELECT * FROM entries_demo WHERE id = :id';
//     let params = {
//         id: postData.id,
//     };
//     db.query(sqlQuery, params, (err, result) => {
//         if (err) {
//             callback(err, null);
//         }
//         console.log(results);
//         callback(null, result);
//     });
// };

// const passwordPepper = 'SeCretPeppa4MySal+';
// const addUser = (postData, callback) => {
//     let sqlInsertSalt =
//         'INSERT INTO users (first_name, last_name, email, password_salt)VALUES (:first_name, :last_name, :email, sha2(UUID(),512));';
//     let params = {
//         first_name: postData.first_name,
//         last_name: postData.last_name,
//         email: postData.email,
//     };
//     console.log(sqlInsertSalt);
//     db.query(sqlInsertSalt, params, (err, results, fields) => {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             let insertedID = results.insertId;
//             let updatePasswordHash =
//                 'UPDATE users SET password_hash = sha2(concat(:password,:pepper,password_salt),512) WHERE web_user_id = :userId;';
//             let params2 = {
//                 password: postData.password,
//                 pepper: passwordPepper,
//                 userId: insertedID,
//             };
//             console.log(updatePasswordHash);
//             db.query(
//                 updatePasswordHash,
//                 params2,
//                 (err, results, fields) => {
//                     if (err) {
//                         console.log(err);
//                         callback(err, null);
//                     } else {
//                         console.log(results);
//                         callback(null, results);
//                     }
//                 }
//             );
//         }
//     });
// };

// const updateUser = (postData, callback) => {
//     let sqlUpdateUser =
//         'UPDATE users SET first_name = :first_name, last_name = :last_name, email = :email WHERE id = :id';
//     let params = {
//         id: postData.id,
//         first_name: postData.first_name,
//         last_name: postData.last_name,
//         email: postData.email,
//     };
//     db.query(sqlUpdateUser, params, (err, result) => {
//         if (err) {
//             callback(err, null);
//         }
//         callback(null, result);
//     });
// };

// const deleteUser = (webUserId, callback) => {
//     let sqlDeleteUser = 'DELETE FROM users WHERE web_user_id = :userID';
//     let params = { userID: webUserId };
//     console.log(sqlDeleteUser);
//     db.query(sqlDeleteUser, params, (err, results, fields) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             console.log(results);
//             callback(null, results);
//         }
//     });
// };

module.exports = {
    getAllEntries,
    getEntriesByDateRange,
    addEntry,
};
