import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';
import bodyParser from 'body-parser'; // Hỗ trợ parse JSON hoặc form data
import { notFound, errorHandler } from './middleware/handle_error.middleware';
import http from "http";
import { initSocket } from "./socket/socket";


dotenv.config();

const app = express();
const server = http.createServer(app);

// Khởi tạo socket server
initSocket(server); // dùng để init WebSocket

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/onlycats', router);

//Xử lý cuối cùng
app.use(notFound);
app.use(errorHandler);

export {app, server};