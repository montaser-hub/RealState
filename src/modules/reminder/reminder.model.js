import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  time: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  },
  category: {
    type: String,
    enum: ['Property Showing', 'Client Follow-up', 'Meeting', 'Deadline', 'Others'],
    required: true,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    index: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 2000,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  googleEventId: {
    type: String,
    default: null,
    index: true
  },
  syncedToGoogle: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for efficient queries
reminderSchema.index({ createdBy: 1, date: 1 });
reminderSchema.index({ date: 1, time: 1 });

export default mongoose.model('Reminder', reminderSchema);




