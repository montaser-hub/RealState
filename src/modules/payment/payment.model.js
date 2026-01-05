import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
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
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['PAID', 'UNPAID'],
    default: 'UNPAID',
    index: true,
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'BANK_TRANSFER', 'BINANCE', 'OTHER'],
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  apartmentReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    default: null,
  },
  assignedType: {
    type: String,
    enum: ['ASSIGNED', 'MANUAL'],
    default: 'MANUAL',
  },
  realOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
  },
  realClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  realConcierge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Concierge',
  },
  // Ownership identifiers (at least one required)
  username: {
    type: String,
    default: null,
    index: true,
  },
  userEmail: {
    type: String,
    default: null,
    index: true,
  },
  ownerName: {
    type: String,
    default: null,
    index: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Pre-save hook: Calculate unpaidAmount and auto-update status
paymentSchema.pre('save', function (next) {
  this.unpaidAmount = Math.max(0, this.totalAmount - this.paidAmount);
  if (this.paidAmount >= this.totalAmount) {
    this.status = 'PAID';
  } else {
    this.status = 'UNPAID';
  }
  next();
});

// Pre-save hook: Validate at least one ownership identifier
paymentSchema.pre('save', function (next) {
  if (!this.username && !this.userEmail && !this.ownerName && !this.realOwner && !this.realClient && !this.realConcierge) {
    return next(new Error('At least one ownership identifier (username, userEmail, ownerName, realOwner, realClient, or realConcierge) is required'));
  }
  next();
});

// Indexes for efficient queries
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ status: 1, paymentDate: -1 });
paymentSchema.index({ paymentMethod: 1 });
paymentSchema.index({ assignedType: 1 });
paymentSchema.index({ apartmentReference: 1 });
paymentSchema.index({ realOwner: 1 });
paymentSchema.index({ realClient: 1 });
paymentSchema.index({ realConcierge: 1 });

export default mongoose.model('Payment', paymentSchema);

