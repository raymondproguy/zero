import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// AUTH ROUTES SKELETON
// TODO: Implement your authentication system
// Uncomment and implement when ready:
// import authRoutes from './routes/auth';
// app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    auth: 'Add your authentication system in src/routes/'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Authentication ready to be implemented in src/routes/`);
});

export default app;
