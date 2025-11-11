import express from 'express';
// import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// DATABASE CONNECTION
// TODO: Uncomment and configure MongoDB connection
// async function connectDB() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Connected to MongoDB database');
//   } catch (error) {
//     console.error('Database connection error:', error);
//     process.exit(1);
//   }
// }
// 
// connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    database: 'MongoDB ready to be configured' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🍃 MongoDB - Add connection in src/server.js`);
});

export default app;
