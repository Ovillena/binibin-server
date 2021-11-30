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
    // let sqlQuery =
    //     'SELECT entry_id, garbage_text, garbage_count, compost_text, compost_count, recycling_text, recycling_count, EXTRACT (MONTH FROM entry_date) AS month, EXTRACT (DAY FROM entry_date) AS day FROM entries ORDER BY entry_id DESC';
    let sqlQuery = `SELECT
SUM(garbage_count) AS garbage_count,
STRING_AGG(garbage_text, '<br /> ') AS garbage_text,
SUM(compost_count) AS compost_count,
STRING_AGG(compost_text, '<br /> ') AS compost_text,
SUM(recycling_count) AS recycling_count,
STRING_AGG(recycling_text, '<br /> ') AS recycling_text,
EXTRACT (MONTH FROM entry_date) AS month,
EXTRACT (DAY FROM entry_date) AS day FROM entries
GROUP BY entry_date
ORDER BY entry_date DESC;`;
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
    let sqlQuery = `SELECT EXTRACT (dow FROM entry_date) AS weekday, TO_CHAR(entry_date, 'mm/dd') AS entry_date, garbage_count, compost_count, recycling_count
    FROM entries
    WHERE entry_date BETWEEN $1 AND $2
    GROUP BY entry_id
    ORDER BY entry_id ASC;`;
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
    let wasteText;
    let wasteCount;
    switch (postData.params.wasteType) {
        case 'garbage':
            wasteText = 'garbage_text';
            wasteCount = 'garbage_count';
            break;
        case 'compost':
            wasteText = 'compost_text';
            wasteCount = 'compost_count';
            break;
        case 'recycling':
            wasteText = 'recycling_text';
            wasteCount = 'recycling_count';
            break;
    }
    let sqlQuery = `SELECT EXTRACT (dow FROM entry_date) AS weekday,
    TO_CHAR(entry_date, 'mm/dd') AS entry_date,
    SUM(${wasteCount}) AS total_items
    FROM entries
    WHERE entry_date BETWEEN $1 AND $2
    GROUP BY entry_date
    ORDER BY entry_date ASC;`;
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
    console.log(
        '-------addEntry------',
        postData,
        '----------------------kjasdflkawf POST DATA'
    );
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
    if (account_id) {
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
        `SELECT item_count, unit, waste_type, TO_CHAR(entry_date, 'dd/mm/yyyy') AS entry_date FROM entries_demo WHERE entry_date = $1`,
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
};
