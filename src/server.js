import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import cors from 'cors';
import connectEventDB from './config/database.js';
import {errorHandler} from './middleware/errorHandler.js';
import profileRoutes from './routes/profileRoutes.js';
import eventRoutes from './routes/eventRoutes.js';



const app = express();

connectEventDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});
app.use(errorHandler);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
