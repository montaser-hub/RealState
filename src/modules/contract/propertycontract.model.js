const propertyContractSchema = new mongoose.Schema({
  property: {
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
  contactType: {
    type: String,
    enum: [ 'owner', 'broker', 'agency' ],
    default: 'owner'
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: [ 'USD', 'EUR', 'LBP' ],
    default: 'USD'
  },
  notes: String,
}, { timestamps: true });

propertyContractSchema.index({ property: 1 });

export default mongoose.model('PropertyContract', propertyContractSchema);
