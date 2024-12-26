const mysql = require('mysql2/promise');

// Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'cx@1076044150',
    database: 'webdata',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 30000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
})

module.exports = pool