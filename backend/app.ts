import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import indexRouter from './routes/indexRouter';
import connectDb from './utils/db';
import dotenv from 'dotenv';
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        iat: number;
        exp: number;
        name: string;
      };
    }
  }
}

const port = 4500;
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
  })
);

connectDb();

app.use('/api', indexRouter);

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server Running on port ${port} `);
});

export { app, server };
