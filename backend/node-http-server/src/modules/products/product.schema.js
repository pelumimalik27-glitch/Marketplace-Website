const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", default: null },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  images: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: "" },
  inventory: {
    quantity: { type: Number, default: 0 }
  },
  status: { type: String, enum: ["pending", "approved", "rejected", "active", "inactive"], default: "pending" }
},
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);

