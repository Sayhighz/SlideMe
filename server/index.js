import express from 'express';
import cors from 'cors';
import http from "http";
import dotenv from 'dotenv';
import configureSocket from "./services/socketService.js";
import uploadRoutes from './routes/uploadRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const server = http.createServer(app);

dotenv.config();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use('/uploads', express.static('uploads'));

app.use('/upload', uploadRoutes);
app.use('/request', requestRoutes);
app.use('/driver', driverRoutes);
app.use('/user', userRoutes);
app.use('/payment', paymentRoutes);
app.use('/notification', notificationRoutes);
app.use('/auth', authRoutes);

configureSocket(server);

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
