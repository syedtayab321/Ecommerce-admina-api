import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 100000
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Home', 'Books', 'Toys']
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    images: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', sku: 'text' });

export default mongoose.model('Product', productSchema);