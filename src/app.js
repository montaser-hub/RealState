import express from 'express';
import userRouter from './modules/user/user.routes.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './utils/globalErrorHandler.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:3001', 'http://localhost:4200'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: "Content-Type",
}));

app.use(cookieParser());

app.use(express.json());


app.use((req, res, next) => {
  console.log('Hello from the MIDDLEWARE ✳️:');
  next();
});

// ROUTES
app.use( '/api/v1/users', userRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this srver`, 404));
});


app.use(globalErrorHandler);

export default app;
