import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    categories: [String],
});

export default mongoose.model("User", userSchema);
