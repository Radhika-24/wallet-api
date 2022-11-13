import mongoose from "mongoose";
const schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const walletSchema = new schema(
  {
    name: { type: String },
    balance: { type: Number },
  },
  { timestamps: true }
);
const model = mongoose.model("wallet", walletSchema);
export default model;
