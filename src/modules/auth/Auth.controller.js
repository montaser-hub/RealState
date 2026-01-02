import * as userService from '../user/user.service.js'
import * as authService from './Auth.service.js'
import catchAsync from '../../middlewares/ctachAsync.js';
import { config } from '../../configs/env.js';
import AppError from '../../utils/appError.js';

export const login = catchAsync( async ( req, res, next ) => {
  const { email, nickname, password } = req.body;

  const { token, user } = await userService.login( email, nickname, password )

  // Set cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + config.cookieExpiresIn
    ),
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https', // only set secure cookie if the request is HTTPS
    httpOnly: true, // recive the cookie and store it, send it automatically in each request
    //sameSite: 'none',
    partitioned: false,
    path: '/'
  };
  if (config.nodeEnv === 'production') cookieOptions.secure = true;
console.log("cookies",cookieOptions)
  res.cookie('jwt', token, cookieOptions);
console.log("token",token)
  res.status(201).json({ message: 'Your login was successfully', token, data: user });
});

export const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: true,
    path: '/'
  });
  res.status(200).json({
    status: 'success',
    message: 'You have been logged out!'
  });
};

// protect routes that require authentication
export const isAuth = catchAsync(async (req, res, next) => {
  //1) Get token and check of it's there
  let token;
  if (
    req.headers?.authorization &&
    req.headers.authorization?.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies?.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  //2) Verification token (errors are handled by catchAsync and verifyToken)
  const currentUser = await authService.verifyToken(token);
  
  //Grant Access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const { user, resetToken } = await authService.forgotPassword(email);
    // 3) Send it to user's email address
  const baseUrl =
    config.nodeEnv === "production"
      ? config.productionUrl
      : `http://localhost:3001`;
   const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
  try {
    const { sendPasswordResetEmail } = await import('../../utils/emailService.js');
    await sendPasswordResetEmail(user, resetUrl);

    res.status( 200 ).json( {
      status: 'success',
      message: 'reset info sent to email'
    } );
  } catch ( err ) {
    console.log( err );
    // cleanup if email sending failed
    await authService.cleanupResetToken(user);
    return next( new AppError( 'Error sending email. Try again later', 500 ));
  }
});

export const resetPassword = catchAsync( async ( req, res, next ) => {
  const { token } = req.params;
  const data = {...req.body};
  const resetPassword = await authService.resetPassword(token, data);
  res.status(200).json({ message: "Password reset successfully", data: resetPassword });
});
