import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import UserRoutes from './routers/users.routes';
import TaskRoutes from './routers/task.routes';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    credentials: true,
}));

app.use('/api/', UserRoutes);
app.use('/api/', TaskRoutes);

export default app;