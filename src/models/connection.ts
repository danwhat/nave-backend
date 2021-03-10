import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: 'navedb',
});

export default connection;
