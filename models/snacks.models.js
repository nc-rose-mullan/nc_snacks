const fs = require('fs/promises')
const db = require('../db/connection')

const fetchSnacks = (category_id, sort_by = 'snack_name') => { 
    const validSortBys = ['snack_name', 'price_in_pence', 'snack_description']

    if (!validSortBys.includes(sort_by)) { 
        return Promise.reject({ status: 400, message: 'bad request' })
    }

    let queryString = `SELECT * FROM snacks`
    const queryVals = []

    if (category_id) { 
        queryString += ` WHERE category_id = $1`
        queryVals.push(category_id)
    }

    queryString += ` ORDER BY ${sort_by}`
    
    return db.query(queryString, queryVals).then(({ rows }) => { 
        if (rows.length === 0) { 
            return Promise.reject({ status: 404, message: 'not found'})
        }
        return rows
    })
}

const fetchSnackBySnackId = (id) => { 
    return db.query(`SELECT * FROM snacks WHERE snack_id=$1`, [id]).then(({ rows }) => { 
        if (rows.length === 0) { 
            return Promise.reject({status: 404, message: "Id not found"})
        }
        return rows[0]
    })
};

const addSnack = (newSnack) => { 
    const { snack_name, snack_description, price_in_pence, category_id } = newSnack

    return db.query(`INSERT INTO snacks (snack_name, snack_description, price_in_pence, category_id) VALUES ($1, $2, $3, $4) RETURNING *`, [snack_name, snack_description, price_in_pence, category_id]).then(({ rows }) => { 
        return rows
    });
}


module.exports = {fetchSnacks, fetchSnackBySnackId, addSnack}