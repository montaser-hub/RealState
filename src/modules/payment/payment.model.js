import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  unpaidAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['PAID', 'UNPAID'],
    required: true,
    default: 'UNPAID',
    index: true,
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'BANK_TRANSFER', 'BINANCE'],
    required: true,
    index: true,
  },
  apartmentReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    index: true,
  },
  assignedType: {
    type: String,
    enum: ['ASSIGNED', 'MANUAL'],
    required: true,
    default: 'MANUAL',
    index: true,
  },
  // Ownership identifiers (at least one required)
  username: {
    type: String,
    index: true,
  },
  userEmail: {
    type: String,
    lowercase: true,
    index: true,
  },
  ownerName: {
    type: String,
    index: true,
  },
  // Link to user if found
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  // Soft delete
  deletedAt: {
    type: Date,
    default: null,
  },
  // Additional notes
  notes: {
    type: String,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for payment history
paymentSchema.virtual('history', {
  ref: 'PaymentHistory',
  localField: '_id',
  foreignField: 'payment',
});

// Pre-save hook to calculate unpaid amount
paymentSchema.pre('save', function (next) {
  this.unpaidAmount = Math.max(0, this.totalAmount - this.paidAmount);
  
  // Auto-update status based on amounts
  if (this.paidAmount >= this.totalAmount) {
    this.status = 'PAID';
  } else {
    this.status = 'UNPAID';
  }
  
  next();
});

// Validation: At least one ownership identifier required
paymentSchema.pre('save', function (next) {
  if (!this.username && !this.userEmail && !this.ownerName) {
    return next(new Error('At least one ownership identifier (username, userEmail, or ownerName) is required'));
  }
  next();
});

// Indexes for filtering
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ status: 1, paymentDate: -1 });
paymentSchema.index({ paymentMethod: 1 });
paymentSchema.index({ apartmentReference: 1 });
paymentSchema.index({ deletedAt: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

