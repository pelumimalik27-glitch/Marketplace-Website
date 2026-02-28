const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  storeName: { type: String, required: true, trim: true },
  contactPhone: { type: String, default: "", trim: true },
  businessAddress: { type: String, default: "", trim: true },
  paymentDetails: { type: String, default: "", trim: true },
  idNumber: { type: String, default: "", trim: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  verificationNotes: { type: String, default: "" }
},
  { timestamps: true }
);

module.exports = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);

