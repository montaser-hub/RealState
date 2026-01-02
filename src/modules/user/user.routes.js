import express from 'express';
import * as userController from './user.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as userSchema from './user.validation.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
//protect all routes after this middleware
router.use(authController.isAuth);

router.patch('/updateMyPassword', validation(userSchema.updatePasswordSchema), userController.updateMyPassword);
router.get('/me', userController.myProfile);
router.patch(
  '/updateMe',
  validation(userSchema.updateMyProfileSchema),
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMyProfile
);

router
  .route('/')
  .get(authorize('users', 'read'), userController.getUsers)
  .post(
    authorize('users', 'create'),
    validation(userSchema.createUserSchema),
    userController.addUser
  );

router
  .route('/:id')
  .get(authorize('users', 'read'), userController.getUser)
  .patch(
    authorize('users', 'update'),
    validation(userSchema.updateUserSchema),
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateUser
  )
  .delete(authorize('users', 'delete'), userController.deleteUser);

router.delete('/softDelete/:id', authorize('users', 'delete'), userController.softDeleteUser);
router.delete('/banned/:id', authorize('users', 'update'), userController.bannedUser);
export default router;
