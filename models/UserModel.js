import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  subscription: {
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
    startDate: Date,
    endDate: Date,
  },
  admin: Boolean,
  languages: Array, 
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
