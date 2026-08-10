import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
dotenv.config();
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/notes',noteRoutes);
const startServer = async () => {
  try {
    await connectDB();
        app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); 
  }
};
startServer();