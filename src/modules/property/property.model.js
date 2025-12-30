import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  referenceId: {
  type: String,
  required: true,
  unique: true,
  index: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  broker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  category: {
    type: String,
    enum: ['apartment', 'shop', 'office', 'land', 'warehouse', 'villa', 'house', 'building', 'loft', 'tower','penthouse', 'other'],
    required: true,
  },
  otherCategory: String,
  parentProperty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  },
  listingType: {
    type: String,
    enum: ['rent', 'sale'],
    required: true,
  },
  city: String,
  state: String,
  zipCode: String,
  country: {
    type: String,
    default: 'Lebanon',
  },
  location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
    validate: {
      validator: val =>
        val.length === 2 &&
        val[0] >= -180 && val[0] <= 180 &&
        val[1] >= -90 && val[1] <= 90,
      message: 'Invalid longitude/latitude values',
    }
  },
  },
  size: {
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    enum: ['sqm'],
    default: 'sqm',
  },
  },
  floor: Number,
  pricing: {
  sale: {
    amount: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'LBP'],
      default: 'USD',
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
  },
  rent: {
    amount: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'LBP'],
      default: 'USD',
    },
    period: {
      type: String,
      enum: ['month', 'year', 'day'],
      default: 'month',
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
  },
  },
  furnishing: {
  type: String,
  enum: ['unfurnished', 'semi-furnished', 'furnished'],
  default: 'unfurnished',
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'archived', 'sold', 'rented', 'banned'],
    default: 'available',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

propertySchema.pre('save', function (next) {
  if (
    this.parentProperty &&
    ['building', 'tower'].includes(this.category)
  ) {
    return next(
      new Error('Buildings or tower cannot be child units')
    );
  }
  next();
});

propertySchema.virtual('units', {
  ref: 'Property',
  localField: '_id',
  foreignField: 'parentProperty',
});

propertySchema.virtual('fullAddress').get(function () {
  return [this.city, this.state, this.zipCode, this.country]
    .filter(Boolean)
    .join(', ');
});

propertySchema.virtual('media', {
  ref: 'PropertyMedia',
  localField: '_id',
  foreignField: 'property',
});

propertySchema.virtual('contracts', {
  ref: 'PropertyContract',
  localField: '_id',
  foreignField: 'property',
});

propertySchema.virtual('features', {
  ref: 'PropertyFeature',
  localField: '_id',
  foreignField: 'property',
  justOne: true
});

propertySchema.virtual('facilities', {
  ref: 'PropertyFacility',
  localField:'_id',
  foreignField:'property',
  justOne:true
 });

// Indexes
propertySchema.index({ parentProperty: 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ location: '2dsphere' });

const Property = mongoose.model('Property', propertySchema);

export default Property;
