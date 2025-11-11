import express from 'express';
// import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// DATABASE CONNECTION
// TODO: Uncomment and configure PostgreSQL connection
// const prisma = new PrismaClient();
// 
// async function connectDB(): Promise<void> {
//   try {
//     await prisma.$connect();
//     console.log('Connected to PostgreSQL database');
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
    database: 'PostgreSQL ready to be configured'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🗄️  PostgreSQL - Run: npx prisma generate && npx prisma db push`);
});

export default app;
