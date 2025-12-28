import mongoose from 'mongoose';

const propertyFeatureSchema = new mongoose.Schema( {
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    index: true
  },
  rooms: {
    bedrooms: Number,
    bathrooms: Number,
    masterBedrooms: Number,
    kitchen: Boolean,
    livingRoom: Boolean,
    diningRoom: Boolean,
    maidsRoom: Boolean,
    balcony: {
      present: Boolean,
      size: Number
    },
  },
  buildingInfo: {
    age: Number,
    totalFloors: Number,
    apartmentsPerFloor: Number
  },
  otherFeatures: mongoose.Schema.Types.Mixed,
}, { timestamps:true });

propertyFeatureSchema.index({ propertyId:1 });
export default mongoose.model('Feature', propertyFeatureSchema);
