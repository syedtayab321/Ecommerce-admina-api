import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceAtSale: {
    type: Number,
    required: true,
    min: 0
  }
});

const saleSchema = new mongoose.Schema(
  {
    items: [saleItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal', 'cash_on_delivery', 'other'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'refunded'],
      default: 'completed'
    },
    saleDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

saleSchema.index({ saleDate: 1 });
saleSchema.index({ 'items.product': 1 });

export default mongoose.model('Sale', saleSchema);