import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true }, // or ObjectId if you have user accounts
  firstName: { type: String, required: true }, // NEW FIELD
  lastName: { type: String, required: true }, // NEW FIELD
  mobile: { type: String, required: true }, // NEW FIELD
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      size: String,
      quantity: Number,
      price: Number,
      name: String,
      image: String,
    }
  ],
  total: { type: Number, required: true },
  address: { type: String, required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
