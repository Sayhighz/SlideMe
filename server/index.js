import express from 'express';
import cors from 'cors';
import http from "http";
import dotenv from 'dotenv';
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import configureSocket from "./services/socketService.js";
import uploadRoutes from './routes/uploadRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js'
import offerRoutes from './routes/offerRoutes.js'

const app = express();
const server = http.createServer(app);

dotenv.config();

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "API Documentation for the system"
        },
        servers: [
            {
                url: "http://localhost:4000",
                description: "Local Server"
            }
        ]
    },
    apis: ["./routes/*.js"], // ใช้ทุกไฟล์ที่อยู่ในโฟลเดอร์ routes
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use('/uploads', express.static('uploads'));

app.use('/upload', uploadRoutes); //ไม่
app.use('/request', requestRoutes); //2
app.use('/review', reviewRoutes); //ไม่
app.use('/offer', offerRoutes); //ไม่
app.use('/driver', driverRoutes); //ไม่
app.use('/customer', customerRoutes); //1
app.use('/user', userRoutes); //ไม่
app.use('/payment', paymentRoutes); //5
app.use('/notification', notificationRoutes); //ไม่
app.use('/auth', authRoutes); //ไม่

configureSocket(server);

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
