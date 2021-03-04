import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: process.env.HOST,
  user: 'root',
  password: 'root',
  database: 'navedb',
});

export default connection;
