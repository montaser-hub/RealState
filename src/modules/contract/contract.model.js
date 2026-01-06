import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema( {
  contractNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'expired', 'terminated', 'renewed', 'cancelled'],
    default: 'draft',
    index: true,
  },
  // Document can be either a URL (link) or uploaded file path
  documentUrl: {
    type: String,
    default: null,
  },
  documentFile: {
    type: String,
    default: null,
  },
  // Reference to User model - Required for N8N integration
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  amount: {
    type: Number,
    required: true
  },
  depositAmount: {
    type: Number,
  },
  currency: {
    type: String,
    enum: [ 'USD', 'EUR', 'LBP' ],
    default: 'USD'
  },
  notes: String,
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
contractSchema.index({ propertyId: 1 }, { background: true });
contractSchema.index({ user: 1 });
contractSchema.index({ client: 1 });

// Static method to update expired contracts
contractSchema.statics.updateExpiredContracts = async function() {
  const now = new Date();
  const result = await this.updateMany(
    {
      endDate: { $lt: now },
      status: { $nin: ['expired', 'terminated', 'cancelled'] }
    },
    {
      $set: { status: 'expired' }
    }
  );
  return result;
};

// Pre-save hook: Validate at least user is provided
contractSchema.pre('save', function(next) {
  if (!this.user) {
    return next(new Error('Contract user is required'));
  }
  next();
});

// Pre-save hook: Automatically set status to expired if endDate has passed
contractSchema.pre('save', function(next) {
  if (this.endDate && this.endDate < new Date()) {
    // Only auto-expire if status is not already expired, terminated, or cancelled
    if (!['expired', 'terminated', 'cancelled'].includes(this.status)) {
      this.status = 'expired';
    }
  }
  next();
});

// Pre-find hook: Automatically update expired contracts before any find query
contractSchema.pre(/^find/, async function(next) {
  // Update expired contracts before fetching
  await this.model.updateExpiredContracts();
  next();
});

export default mongoose.model('Contract', contractSchema);
