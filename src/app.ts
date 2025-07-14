import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';
import bodyParser from 'body-parser'; // chưa biết để làm gì 
import { notFound, errorHandler } from './middleware/handle_error.middleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/onlycats', router);

//Xử lý cuối cùng
app.use(notFound);
app.use(errorHandler);

export default app;