const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Your database username
    password: '', // Your database password
    database: 'dental_clinic' // Your database name
});

module.exports = pool;
