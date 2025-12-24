const propertyFeatureSchema = new mongoose.Schema({
  property: {
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
  commercialFeatures: mongoose.Schema.Types.Mixed,
}, { timestamps:true });

propertyFeatureSchema.index({ property:1 });
export default mongoose.model('PropertyFeature', propertyFeatureSchema);
