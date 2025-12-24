import mongoose from 'mongoose';

const propertyMediaSchema = new mongoose.Schema( {
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    index: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  url: {
    type: String,
    required: true
  },
  isPrimary: {
    type: Boolean,
  },
  order: {
    type: Number,
    required: true
  },
  caption: String,
}, { timestamps: true });

propertyMediaSchema.index({ property: 1, order: 1 });

export default mongoose.model('PropertyMedia', propertyMediaSchema);
