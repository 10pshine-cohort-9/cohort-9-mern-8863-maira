import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
dotenv.config();
const app = express();
app.use(express.json());
connectDB();
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});