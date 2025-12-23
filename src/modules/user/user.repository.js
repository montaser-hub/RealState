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

export const countAll = () => User.countDocuments();

export const countFiltered = (filter) => User.countDocuments(filter);