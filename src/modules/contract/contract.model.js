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
  contractType: {
    type: String,
    enum: [ 'owner', 'broker', 'agency' ],
    default: 'owner'
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'expired', 'terminated', 'renewed', 'cancelled'],
    default: 'draft',
    index: true,
  },
  documentUrl: {
    type: String,
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
}, { timestamps: true });

contractSchema.index({ propertyId: 1 });

export default mongoose.model('Contract', contractSchema);
