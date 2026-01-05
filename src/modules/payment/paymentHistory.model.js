import mongoose from 'mongoose';

const paymentHistorySchema = new mongoose.Schema({
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
    index: true,
  },
  previousStatus: {
    type: String,
    enum: ['PAID', 'UNPAID'],
    required: true,
  },
  newStatus: {
    type: String,
    enum: ['PAID', 'UNPAID'],
    required: true,
  },
  changeDate: {
    type: Date,
    default: Date.now,
    index: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  changedByName: {
    type: String,
    default: null,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

paymentHistorySchema.index({ paymentId: 1, changeDate: -1 });

export default mongoose.model('PaymentHistory', paymentHistorySchema);



