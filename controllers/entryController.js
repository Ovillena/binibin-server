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
const getAllEntries = (account_id, callback) => {
    // let sqlQuery =
    //     'SELECT entry_id, garbage_text, garbage_count, compost_text, compost_count, recycling_text, recycling_count, EXTRACT (MONTH FROM entry_date) AS month, EXTRACT (DAY FROM entry_date) AS day FROM entries ORDER BY entry_id DESC';
    let sqlQuery = `SELECT
SUM(garbage_count) AS garbage_count,
array_to_string(array_agg(CASE WHEN garbage_text = '' THEN NULL ELSE garbage_text END), '\n') garbage_text,
SUM(compost_count) AS compost_count,
array_to_string(array_agg(CASE WHEN compost_text = '' THEN NULL ELSE compost_text END), '\n') compost_text,
SUM(recycling_count) AS recycling_count,
array_to_string(array_agg(CASE WHEN recycling_text = '' THEN NULL ELSE recycling_text END), '\n') recycling_text,
EXTRACT (MONTH FROM entry_date) AS month,
EXTRACT (DAY FROM entry_date) AS day
FROM entries
JOIN accounts ON accounts.account_id = entries.account_id
WHERE entries.account_id = $1
GROUP BY entry_date
ORDER BY entry_date DESC;`;
    db.query(sqlQuery, [account_id], (err, results) => {
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
    JOIN accounts ON accounts.account_id = entries.account_id
    WHERE entry_date BETWEEN $1 AND $2
    AND entries.account_id = $3
    GROUP BY entry_id
    ORDER BY entry_id ASC;`;
    console.log(
        'getEntriesByDateRange',
        postData.params.startDate,
        postData.params.endDate
    );
    console.log(sqlQuery);
    db.query(
        sqlQuery,
        [
            postData.params.startDate,
            postData.params.endDate,
            postData.user.account_id,
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
    console.log(
        'getEntriesByDateRange',
        postData.params.startDate,
        postData.params.endDate
    );
    let sqlQuery = `SELECT EXTRACT (dow FROM entry_date) AS weekday,
    TO_CHAR(entry_date, 'mm/dd') AS entry_date,
    SUM(${wasteCount}) AS total_items
    FROM entries
    JOIN accounts ON accounts.account_id = entries.account_id
    WHERE entry_date BETWEEN $1 AND $2
    AND entries.account_id = $3
    GROUP BY entry_date
    ORDER BY entry_date ASC;`;
    console.log(sqlQuery);
    db.query(
        sqlQuery,
        [
            postData.params.startDate,
            postData.params.endDate,
            postData.user.account_id,
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

// GET ROUTE: api/entries/:wasteType/:startDate/:endDate/month
const getEntriesByMonthRangeAndType = (postData, callback) => {
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
    console.log(
        'getEntriesByDateRange MONTH MONTH MONTHTHHHHHH',
        postData.params.startDate,
        postData.params.endDate
    );
    let sqlQuery = `SELECT TO_CHAR(entry_date, 'yy/mm') as month_entries,
    SUM(${wasteCount}) AS total_items
    FROM entries
    JOIN accounts ON accounts.account_id = entries.account_id
    WHERE entry_date BETWEEN $1 AND $2
    AND entries.account_id = $3
    GROUP BY month_entries
    ORDER BY month_entries ASC;`;
    console.log(sqlQuery);
    db.query(
        sqlQuery,
        [
            postData.params.startDate,
            postData.params.endDate,
            postData.user.account_id,
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
const addEntry = (postData, account_id, callback) => {
    console.log(
        '-------addEntry------',
        postData.items,
        '----------------------kjasdflkawf POST DATA'
    );

    const entryValues = [];
    const values = [];

    for (let i = 0; i < postData.items.length; i++) {
        let entry = postData.items[i]; 
        entryValues.push([entry.name, entry.weight, entry.date, account_id]);
        values.push(entry.name, entry.weight, entry.date, account_id); 
    }
  
    let valuesString = ''; 

    const generateValuesStr = (array) => {
        for (let i = 0; i < array.length; i++) {
            let pos1 = 1 + 4 * i; 
            let pos2 = 2 + 4 * i;
            let pos3 = 3 + 4 * i;
            let pos4 = 4 + 4 * i;
            let string = `($${pos1}, $${pos2}, $${pos3}, $${pos4})`;
            if (i === 0) {
                valuesString = string;
            } else {
                valuesString = valuesString.concat(', ', string);
            }
            console.log(i);
        }
    };
    generateValuesStr(entryValues);
    console.log(valuesString); 

    const sqlQuery = `INSERT into entries_new
    (item_name, weight_kg, entry_date, account_id)
    VALUES ${valuesString}`;

    if (account_id) {
        db.query(sqlQuery, values, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result);
        });
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
    getEntriesByMonthRangeAndType,
};
