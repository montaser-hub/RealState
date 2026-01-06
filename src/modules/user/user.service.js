import * as userRepo from "./user.repository.js"
import * as authService from "../auth/Auth.service.js"
import AppError from "../../utils/appError.js"
import { getAllDocuments } from "../../utils/queryUtil.js"

export const login = async (email, nickname, password) => {
  // 1) check if the user && password is correct
  const user = await userRepo.findOne(email, nickname);
  //since the instance method that is available on all users is documented
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }
  // 2) if everything ok, return token to client
  return authService.createTokenPayload(user);
}
export const isExists = async( email, nikename ) => {
  const exists = await userRepo.findOne( email, nikename )
  if(exists) throw new AppError("User Already Exists", 400)
}


export const addUser = async ( data ) => {
  const {email, nickname, ...body} = data

  await isExists( email, nickname )
  body.password="P@ssw0rd"
  return await userRepo.create({email, nickname, ...body})
}

export const updateUser = async ( id, data ) => {
  const { email, nikename, ...body } = data

  await isExists( email, nikename )

  const updatedUser = await userRepo.update(id, { email, nikename, ...body })

  if(!updatedUser) throw new AppError("User Not Found", 404)

  return updatedUser
}
export const getUser = async ( id ) => {
  const user = await userRepo.findById( id )
  if(!user) throw new AppError("User Not Found", 404)
  return user
}

export const getUsers = async ( queryParams ) => {
  const searchableFields = ['firstName', 'lastName', 'role', 'email', 'nickname', 'status', 'contactNumber', 'AlternativePhone', 'dateOfBirth'];
  return await getAllDocuments( userRepo, queryParams, searchableFields);
}

export const updatePassword = async ( email, data ) => {
  if (data.newPassword !== data.confirmPassword) {
    throw new AppError('Passwords do not match', 400);
  }
    // 1) Get user from token
  const user = await userRepo.findOne(email);
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(data.currentPassword, user.password))) {
    throw new AppError('Incorrect current password', 401);
  }
  // 3) Check if new password is different from current password
  if (data.currentPassword === data.newPassword) {
    throw new AppError('New password must be different from current password', 400);
  }
  // 4) Update password
  user.password = data.newPassword;
  await user.save();

  return authService.createTokenPayload(user);
}

export const softDeleteUser = async (id) => {
  const user = await userRepo.update(id, { status: "deleted", deletedAt: Date.now() })
  if (!user) throw new AppError("User Not Found", 404)
  return user
}

export const bannedUser = async (id) => {
  const user = await userRepo.update(id, { status: "banned", bannedAt: Date.now() })
  if (!user) throw new AppError("User Not Found", 404)
  return user
}

export const deleteUser = async (id) => {
  const user = await userRepo.deleteOne(id)
  if (!user) throw new AppError("User Not Found", 404)
  return user
}



