import express from 'express';
import dotenv from 'dotenv';
import router from './routes';
import bodyParser from 'body-parser'; // chưa biết để làm gì 

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use('/onlycats', router);

export default app;