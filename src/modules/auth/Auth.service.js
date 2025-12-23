import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { config } from "../../configs/env.js";
import * as userService from '../user/user.service.js'
import * as userRepo from '../user/user.repository.js'
import { promisify } from "util";
import AppError from "../../utils/appError.js";

export const signToken = id => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

export const createTokenPayload = (user) => {
  const token = signToken(user?._id);
  // Remove sensitive fields
  // Convert Mongoose document → plain object AND remove sensitive fields.
  const cleanUser = user.toObject({ getters: true });;
  delete cleanUser.password;
  delete cleanUser.passwordChangedAt;
  delete cleanUser.passwordResetToken;
  delete cleanUser.passwordResetExpires;

  return { token, user: cleanUser };
};

export const verifyToken = async( token ) => {
  //2) verification token
  const decoded = await promisify( jwt.verify )( token, config?.jwtSecret );
  //3) check if user still exists
  const currentUser = await userService.getUser(decoded?.id);
  if (!currentUser) {
    throw new AppError('User no longer exists', 401);
  }

  //4) check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded?.iat)) {
    throw new AppError('User recently changed password! Please login again', 401);
  }
  return currentUser
};

export const forgotPassword = async ( email ) => {
  // 1) Get user based on POSTed email address
  const user = await userRepo.findOne(email);
  if ( !user ) {
    throw new AppError('No user found with that email', 404);
  }
  // 2) Generate random token
  const resetToken = user.changedPasswordRestToken();
  await user.save( { validateBeforeSave: false } );
  return { user, resetToken }
}

export const cleanupResetToken = async (user) => {
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });
};

export const resetPassword = async ( token, data ) => {
  if(data.password !== data.confirmPassword) {
    throw new AppError('Passwords do not match', 400);
  }
  // 1) Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await userRepo.findByToken(hashedToken);
  // 2) if token has not expired, and there is user, set the new password
  if (!user) {
    throw new AppError('Token is invalid or expired', 400);
  }
  user.password = data.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) update changedPasswordAt property for the user in user model

  // 4) log the user in, send JWT
  createTokenPayload(user);
};
