import mongoose, { SchemaTypes } from "mongoose";

const ProductSalesSchema = new mongoose.Schema(
  {
    isSale: { type: Boolean, default: true },
    products: [{
      productId: {
        type: SchemaTypes.ObjectId,
        ref: 'Product',
        required: true
      },
      ketdi: {
        type: Number,
        default: 0,
        min: 0,
      }
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Sale", ProductSalesSchema);