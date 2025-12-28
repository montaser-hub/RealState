import mongoose from 'mongoose';

const propertyFacilitySchema = new mongoose.Schema( {
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    index: true
 },
  elevator: Boolean,
  electricity: Boolean,
  parking: Number,
  visitorParking: Number,
  gym: Boolean,
  pool: Boolean,
  sauna: Boolean,
  kidsArea: Boolean,
  garden: Boolean,
  executiveLounge: Boolean,
  fullTimeConcierge: Boolean,
  fullTimeSecurity: Boolean,
  otherFacilities: [String]
},{
    timestamps: true
});

propertyFacilitySchema.index({ propertyId:1 });
export default mongoose.model('Facility', propertyFacilitySchema);
