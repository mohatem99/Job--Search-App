import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  recoveryEmail: {
    type: String,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["User", "Company_HR"],
    required: true,
    default: "User",
  },
  DOB: { type: Date, required: true },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },

  encryptedOtp: String,
  otpExpires: Date,
  otpVerified: Boolean,
  passwordChangedAt: Date,
});

// Middleware to run before create and update operations
userSchema.pre("save", async function (next) {
  this.username = `${this.firstName}  ${this.lastName}`;
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  this.username = `${this.firstName}  ${this.lastName}`;
  next();
});
const User = model("User", userSchema);
export default User;
