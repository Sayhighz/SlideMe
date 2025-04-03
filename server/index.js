import express from 'express';
import cors from 'cors';
import http from "http";
import dotenv from 'dotenv';
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
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const server = http.createServer(app);
dotenv.config();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use('/uploads', express.static('uploads'));
app.use('/upload', uploadRoutes);
app.use('/request', requestRoutes);
app.use('/review', reviewRoutes);
app.use('/offer', offerRoutes)
app.use('/driver', driverRoutes);
app.use('/customer', customerRoutes)
app.use('/user', userRoutes);
app.use('/payment', paymentRoutes);
app.use('/notification', notificationRoutes);
app.use('/auth', authRoutes);



const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SLIDE ME API Document",
            version: "1.0.0",
            description: "นายสุธา ทองคง รหัส 66025690 สาขาวิชาวิทยาการคอมพิวเตอร์และนวัฒกรรมการพัฒนาซอฟต์แวร์ <br> คณะเทคโนโลยีสารสนเทศ มหาวิทยาลัยศรีปทุม  <br> สร้าง API สําหรับโครงงาน SLIDE ME Version 1.0.0 ตามมาตรฐาน OpenAPI 3.0.0 <br> <ul><li>Customer - จำนวน 4 APIs<li> Review - จำนวน 1 APIs <li> Request - จำนวน 3 APIs</ul> โดยรายละเอียดของแต่ละ API แสดงไว้ตามด้านล่างนี้",
        },
        servers: [
            {
                url: "http://localhost:4000",  // เซิร์ฟเวอร์สำหรับการพัฒนา
                description: "Local development server"
            } 
            
        ],
    },
    apis: ["./routes/customerRoutes.js" , "./routes/reviewRoutes.js" , "./routes/requestRoutes.js"]  // ระบุไฟล์ที่มี Swagger comments
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

configureSocket(server);




const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
