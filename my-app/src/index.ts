import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to my-app',
    timestamp: new Date().toISOString(),
    language: 'TypeScript'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ Healthy',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log('🚀 Server running on http://localhost:' + PORT);
});
