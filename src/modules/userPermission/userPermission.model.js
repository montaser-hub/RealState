import mongoose from 'mongoose';

const userPermissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  resource: {
    type: String,
    required: true,
    enum: ['properties', 'contracts', 'users', 'payments', 'features', 'facilities', 'media', 'reminders']
  },
  actions: {
    type: [String],
    enum: ['read', 'create', 'update', 'delete'],
    default: ['read']
  }
}, {
  timestamps: true
});

// Compound index to ensure unique user-resource combination
userPermissionSchema.index({ userId: 1, resource: 1 }, { unique: true });

export default mongoose.model('UserPermission', userPermissionSchema);


