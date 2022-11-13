import mongoose from "mongoose";
const schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const transactionSchema = new schema(
  {
    walletId: { type: String },
    description: { type: String },
    amount: { type: Number },
    balance: { type: Number },
    type: { type: String, enum: ["CREDIT", "DEBIT"] },
  },
  { timestamps: true }
);
const model = mongoose.model("transaction", transactionSchema);
export default model;
