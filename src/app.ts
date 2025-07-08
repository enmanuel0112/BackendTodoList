import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import UserRoutes from './routers/users.routes';
import TaskRoutes from './routers/task.routes';
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/', UserRoutes);
app.use('/api/', TaskRoutes);

export default app;