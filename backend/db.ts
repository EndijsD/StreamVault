import mysql from 'mysql2/promise'

const db = mysql.createPool({
  user: process.env.MYSQL_USER,
  host: process.env.MYSQL_HOST,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
  ssl: { rejectUnauthorized: false },
})

export default db
