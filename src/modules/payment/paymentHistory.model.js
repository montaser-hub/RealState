import mongoose from 'mongoose';

const paymentHistorySchema = new mongoose.Schema({
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
    index: true,
  },
  previousStatus: {
    type: String,
    enum: ['PAID', 'UNPAID'],
  },
  newStatus: {
    type: String,
    enum: ['PAID', 'UNPAID'],
    required: true,
  },
  changeDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null means system change
  },
  changedByName: {
    type: String, // Store name for audit even if user is deleted
  },
  reason: {
    type: String,
  },
  notes: {
    type: String,
  },
  // Store amounts at time of change for audit
  totalAmount: {
    type: Number,
  },
  paidAmount: {
    type: Number,
  },
  unpaidAmount: {
    type: Number,
  },
}, {
  timestamps: true,
});

// Indexes
paymentHistorySchema.index({ payment: 1, changeDate: -1 });
paymentHistorySchema.index({ changeDate: -1 });

// Prevent deletion - audit-safe
paymentHistorySchema.pre('remove', function (next) {
  next(new Error('Payment history records cannot be deleted for audit purposes'));
});

paymentHistorySchema.pre('findOneAndDelete', function (next) {
  next(new Error('Payment history records cannot be deleted for audit purposes'));
});

paymentHistorySchema.pre('deleteOne', function (next) {
  next(new Error('Payment history records cannot be deleted for audit purposes'));
});

const PaymentHistory = mongoose.model('PaymentHistory', paymentHistorySchema);

export default PaymentHistory;

