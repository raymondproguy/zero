import express from 'express';
// import Database from 'better-sqlite3';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// DATABASE CONNECTION
// TODO: Uncomment and configure SQLite connection
// const db = new Database(process.env.SQLITE_PATH || 'database.sqlite');
// 
// // Create example table
// db.exec(`
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     email TEXT UNIQUE NOT NULL,
//     name TEXT,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   )
// `);
// 
// console.log('Connected to SQLite database');

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    database: 'SQLite ready to be configured'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💾 SQLite - Add connection in src/server.ts`);
});

export default app;
