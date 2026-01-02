import mongoose from 'mongoose';

const rolePermissionSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['admin', 'manager', 'agent', 'broker', 'guest'],
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

// Compound index to ensure unique role-resource combination
rolePermissionSchema.index({ role: 1, resource: 1 }, { unique: true });

export default mongoose.model('RolePermission', rolePermissionSchema);


