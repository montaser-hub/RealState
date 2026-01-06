import express from 'express';
import userRouter from './modules/user/user.routes.js';
import propertyRouter from './modules/property/property.routes.js';
import featureRouter from './modules/feature/feature.routes.js';
import facilityRouter from './modules/facilities/facility.routes.js';
import contractRouter from './modules/contract/contract.routes.js';
import rolePermissionRouter from './modules/rolePermission/rolePermission.routes.js';
import userPermissionRouter from './modules/userPermission/userPermission.routes.js';
import reminderRouter from './modules/reminder/reminder.routes.js';
import googleCalendarRouter from './modules/googleCalendar/googleCalendar.routes.js';
import paymentRouter from './modules/payment/payment.routes.js';
import emailRouter from './modules/email/email.routes.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './utils/globalErrorHandler.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3001', 
      'http://localhost:4200'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost and local network IPs
    if (allowedOrigins.includes(origin) || 
        origin.includes('localhost') || 
        origin.match(/^http:\/\/192\.168\.\d+\.\d+:\d+$/) ||
        origin.match(/^http:\/\/10\.\d+\.\d+\.\d+:\d+$/)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
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
app.use( '/api/v1/properties', propertyRouter );
app.use( '/api/v1/features', featureRouter );
app.use( '/api/v1/facilities', facilityRouter );
app.use( '/api/v1/contracts', contractRouter );
app.use( '/api/v1/role-permissions', rolePermissionRouter );
app.use( '/api/v1/user-permissions', userPermissionRouter );
app.use( '/api/v1/reminders', reminderRouter );
app.use( '/api/v1/google', googleCalendarRouter );
app.use( '/api/v1/payments', paymentRouter );
app.use( '/api/v1/emails', emailRouter );


app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this srver`, 404));
});


app.use(globalErrorHandler);

export default app;
