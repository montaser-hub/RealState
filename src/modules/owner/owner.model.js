import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
  },
  contactNumber: {
    type: String,
  },
  alternativePhone: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  photo: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active',
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

ownerSchema.virtual('fullName')
  .get(function () {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  });

// Indexes
ownerSchema.index({ email: 1 }, { unique: true, sparse: true });
ownerSchema.index({ status: 1 });
ownerSchema.index({ firstName: 1, lastName: 1 });

const Owner = mongoose.model('Owner', ownerSchema);

export default Owner;

