import User from './user.model.js'

export const findOne = async ( email, nickname ) => {
  const orConditions = [];

    if (email) orConditions.push({ email: new RegExp(`^${email}$`, 'i') });
    if (nickname) orConditions.push({ nickname: new RegExp(`^${nickname}$`, 'i') });

    if (orConditions.length === 0) return null;
  return await User.findOne({
    $or: orConditions
  }).select('+password')
}

export const create = async (data) => {
  return await User.create(data)
}

export const update = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true })
}


export const getUser = async (id) => {
  return (await User.findById(id))
}


export const findById = async (id) => {
  return await User.findById(id)
}

export const deleteOne = async (id) => {
  return await User.findByIdAndDelete(id);
}

export const findAll = () => {
  return User.find()
}

export const findByToken = async (hashedToken) => {
  return await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })
}

export const findByEmail = async (email) => {
  return await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
}

export const findByNickname = async (nickname) => {
  return await User.findOne({ nickname: new RegExp(`^${nickname}$`, 'i') });
}

export const findByIdentifier = async (identifier) => {
  // Check if identifier is a valid MongoDB ObjectId (24 hex characters)
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  
  if (objectIdPattern.test(identifier)) {
    // Try as user ID first
    const userById = await User.findById(identifier);
    if (userById) return userById;
  }
  
  // Check if it's an email (contains @)
  if (identifier.includes('@')) {
    const userByEmail = await User.findOne({ email: new RegExp(`^${identifier}$`, 'i') });
    if (userByEmail) return userByEmail;
  }
  
  // Otherwise, treat as nickname
  const userByNickname = await User.findOne({ nickname: new RegExp(`^${identifier}$`, 'i') });
  if (userByNickname) return userByNickname;
  
  return null;
}

export const countAll = () => User.countDocuments();

export const countFiltered = (filter) => User.countDocuments(filter);