import mongoose from "mongoose";

const newsSchema = mongoose.Schema({
    title: String,
    category: String,
    content: String,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("News", newsSchema);
