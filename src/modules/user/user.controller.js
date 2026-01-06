import * as userService from './user.service.js'
import catchAsync from "../../middlewares/ctachAsync.js";
import { resizeAndSaveImage } from "../../utils/fileUpload.js";
import { uploadSingle } from "../../utils/multer.js";

//Upload and resize user photo
// Only process if content-type is multipart/form-data, otherwise skip
const multerUpload = uploadSingle("photo", "image");
export const uploadUserPhoto = (req, res, next) => {
  // Only run multer if content-type is multipart/form-data
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    return multerUpload(req, res, next);
  }
  // For JSON requests, skip multer and continue
  next();
};

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = await resizeAndSaveImage(req.file, {
    folder: "users",
    prefix: `user-${req?.user.id}`,
  });

  next();
});

// Regular User
export const myProfile = catchAsync( async ( req, res, next ) => {
  const id = req?.user.id
  const user = await userService.getUser(id)
  res.status(200).json({ message: "User fetched successfully", data: user });
})


export const updateMyProfile = catchAsync( async ( req, res, next ) => {
  const id = req?.user.id
  const data = { ...req.body }
  if (req?.file && req?.file.filename) {
    data.photo = req?.file.filename;
  }
  const updatedUser = await userService.updateUser(id, data)
  res.status(200).json({ message: "User updated successfully", data: updatedUser });
})


export const updateMyPassword = catchAsync( async ( req, res, next ) => {
  const email = req?.user.email
  const data = { ...req.body }
  await userService.updatePassword(email, data)
  res.status(200).json({ message: "User password updated successfully" });
})


// Admin, Manager
export const addUser = catchAsync( async ( req, res, next ) => {
  const data = { ...req.body }
  if (req.file && req.file.filename) {
    data.photo = req.file.filename;
  }

  const userData = await userService.addUser(data)
  
  // Send welcome email (don't fail if email fails)
  try {
    const { sendWelcomeEmail } = await import('../../utils/emailService.js');
    await sendWelcomeEmail(userData, data.password);
  } catch (error) {
    console.error('Failed to send welcome email:', error.message);
    // Continue even if email fails
  }
  
  res.status(200).json({ message: "User added successfully", data: userData });
});


export const updateUser = catchAsync( async ( req, res, next ) => {
  const id = req.params.id
  const data = { ...req.body }
  if (req.file && req.file.filename) {
    data.photo = req.file.filename;
  }
  const updatedUser = await userService.updateUser(id, data)
  res.status(200).json({ message: "User updated successfully", data: updatedUser });
});

export const softDeleteUser = catchAsync( async ( req, res, next ) => {
  const id = req.params.id
  const user = await userService.softDeleteUser(id)
  res.status(200).json({ message: "User deleted successfully", data: user });
})

export const bannedUser = catchAsync( async ( req, res, next ) => {
  const id = req.params.id
  const user = await userService.bannedUser(id)
  res.status(200).json({ message: "User banned successfully", data: user });
} )

export const deleteUser = catchAsync( async ( req, res, next ) => {
  const id = req.params.id
  await userService.deleteUser(id)
  res.status(200).json({ message: "User deleted successfully" });
});


export const getUser = catchAsync( async ( req, res, next ) => {
  const id = req.params.id
  const user = await userService.getUser(id)
  res.status(200).json({ message: "User fetched successfully", data: user });
});


export const getUsers = catchAsync(async (req, res, next) => {
  const query = { ...req.query }

  const { data, total, totalFiltered } = await userService.getUsers(query)
  res.status(200).json( {
    message: "Users fetched successfully",
    totalFiltered,
    total,
    limit: query.limit,
    page: query.page,
    data
  } );
});

