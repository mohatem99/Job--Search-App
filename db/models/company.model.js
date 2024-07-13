import { Schema, model } from "mongoose";

const companySchema = new Schema({
  companyName: {
    type: String,
    unique: true,
    required: true,
  },

  slug: {
    type: String,
  },

  description: { type: String },
  industry: { type: String },
  address: { type: String },
  numberOfEmployees: {
    min: { type: Number },
    max: { type: Number },
  },

  companyEmail: {
    type: String,
    unique: true,
    required: true,
  },
  companyHr: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Company = model("Company", companySchema);

export default Company;
