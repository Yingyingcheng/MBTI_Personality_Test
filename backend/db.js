import mysql from "mysql2/promise";
import "dotenv/config";

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mbti_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initialize database tables
async function initDB() {
  try {
    const connection = await pool.getConnection();

    // Create users table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create test_results table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS test_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        result_type VARCHAR(10) NOT NULL,
        score JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    connection.release();
    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

export { pool, initDB };
