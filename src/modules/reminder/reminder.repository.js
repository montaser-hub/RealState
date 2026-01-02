import Reminder from './reminder.model.js';

export const create = async (data) => {
  const reminder = await Reminder.create(data);
  return await Reminder.findById(reminder._id)
    .populate('createdBy', 'email firstName lastName fullName nickname role');
};

export const findById = async (id) => {
  return await Reminder.findById(id)
    .populate('createdBy', 'email firstName lastName fullName nickname role');
};

export const update = async (id, data) => {
  return await Reminder.findByIdAndUpdate(id, data, { new: true })
    .populate('createdBy', 'email firstName lastName fullName nickname role');
};

export const deleteOne = async (id) => {
  return await Reminder.findByIdAndDelete(id);
};

export const findOne = (filter) => {
  return Reminder.find(filter)
    .populate('createdBy', 'email firstName lastName fullName nickname role');
};

export const findAll = () => {
  return Reminder.find()
    .populate('createdBy', 'email firstName lastName fullName nickname role');
};

export const countAll = () => Reminder.countDocuments();

export const countFiltered = (filter) => Reminder.countDocuments(filter);

