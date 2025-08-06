import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true
  },
  connectTimeout: 20000, // 20 seconds
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000 // 10 seconds
});

export default pool;
