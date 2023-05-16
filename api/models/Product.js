import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["qop", "ta", "litr"], required: true },
    size: { type: Number, default: null },
    soni: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);