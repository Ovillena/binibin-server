const db = include('models/databaseConnection');

//GET ROUTE: api/items
const getAllItems = (callback) => {
    let sqlQuery = 'SELECT item_id, item_name, waste_type_id, unit FROM items';
    db.query(sqlQuery, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// GET ROUTE: api/entries
const getAllEntries = (callback) => {
    let sqlQuery =
        'SELECT entry_id, item_name, item_count, unit, waste_type, EXTRACT (MONTH FROM entry_date) AS month, EXTRACT (DAY FROM entry_date) AS day, account_id FROM entries_demo ORDER BY entry_date DESC, entry_id DESC';
    db.query(sqlQuery, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// GET: api/entries/:accountId
const getAllEntriesById = (postData, callback) => {
    let sqlQuery =
        'SELECT entry_id, item_name, item_count, unit, waste_type, EXTRACT (MONTH FROM entry_date) AS month, EXTRACT (DAY FROM entry_date) AS day, account_id FROM entries_demo WHERE account_id = $1 ORDER BY entry_date DESC, entry_id DESC';
    db.query(sqlQuery, [postData.params.accountId], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// GET ROUTE: api/entries/:startDate/:endDate
const getEntriesByDateRange = (postData, callback) => {
    let sqlQuery = `SELECT EXTRACT (dow FROM entry_date) AS weekday, TO_CHAR(entry_date, 'mm/dd') AS entry_date, SUM(item_count) AS total_items, waste_type FROM entries_demo WHERE entry_date BETWEEN $1 AND $2 GROUP BY entry_date, waste_type ORDER BY entry_date ASC;`;
    console.log(sqlQuery);
    db.query(
        sqlQuery,
        [postData.params.startDate, postData.params.endDate],
        (err, result) => {
            if (err) {
                callback(err, null);
            }
            console.log('_______________________CONTROLLER');
            console.log(result);
            callback(null, result);
        }
    );
};

// GET ROUTE: api/entries/:wasteType/:startDate/:endDate
const getEntriesByDateRangeAndType = (postData, callback) => {
    let sqlQuery = `SELECT EXTRACT (dow FROM entry_date) AS weekday,
    TO_CHAR(entry_date, 'mm/dd') AS entry_date,
    SUM(item_count) AS total_items, waste_type
    FROM entries_demo
    WHERE entry_date BETWEEN $1 AND $2
    AND waste_type = $3
    GROUP BY entry_date, waste_type
    ORDER BY entry_date ASC
    ;`;
    console.log(sqlQuery);
    db.query(
        sqlQuery,
        [
            postData.params.startDate,
            postData.params.endDate,
            postData.params.wasteType,
        ],
        (err, result) => {
            if (err) {
                callback(err, null);
            }
            console.log('_______________________CONTROLLER');
            console.log(result);
            callback(null, result);
        }
    );
};

// POST ROUTE: api/entries/add ---OLD---
// const addEntry = (postData, callback) => {
//     const { item_name, item_count, waste_type, account_id } = postData;
//     let sqlQuery =
//         'INSERT INTO entries_demo (item_name, item_count, waste_type, account_id) VALUES ($1, $2, $3, $4)';
//     if (item_name && item_count && waste_type && account_id) {
//         db.query(
//             sqlQuery,
//             [item_name, item_count, waste_type, account_id],
//             (err, result) => {
//                 if (err) {
//                     callback(err, null);
//                 }
//                 callback(null, result);
//             }
//         );
//     } else {
//         callback('missing data', null);
//     }
// };

//---------------------------

// POST ROUTE: api/entries/add
const addEntry = (postData, callback) => {
    const {
        garbage_text,
        garbage_count,
        compost_text,
        compost_count,
        recycling_text,
        recycling_count,
        account_id,
    } = postData;
    let sqlQuery =
        'INSERT INTO entries (garbage_text, garbage_count, compost_text, compost_count, recycling_text, recycling_count, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    if (
        garbage_text &&
        garbage_count &&
        compost_text &&
        compost_count &&
        recycling_text &&
        recycling_count &&
        account_id
    ) {
        db.query(
            sqlQuery,
            [
                garbage_text,
                garbage_count,
                compost_text,
                compost_count,
                recycling_text,
                recycling_count,
                account_id,
            ],
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

//-------------------------------

const getEntriesByDate = (date, callback) => {
    database.query(
        `SELECT item_count, unit, waste_type, TO_CHAR(entry_date, 'dd/mm/yyyy') AS entry_date FROM entries_demo WHERE emtry_date = $1 ORDER BY entry_id DESC`,
        [date],
        (err, result) => {
            if (err) {
                callback(err, null);
            }

            callback(null, result);
            // response.status(200).json(results.rows);
        }
    );
};

module.exports = {
    getAllEntries,
    getEntriesByDateRange,
    getEntriesByDateRangeAndType,
    addEntry,
    getAllItems,
    getEntriesByDate,
    getAllEntriesById,
};
