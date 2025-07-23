import mongoose from "mongoose";

const SnippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    enum: ["js", "ts", "css", "html", "jsx", ".env", "c", 'c++', 'java', 'rust', 'py'],
    default: "other",
  },
  tags: {
    type: [String],
    default: [],
  },
  publicityStatus: {
    type: String,
    enum: ["private", "approving", "public"],
    default: "private"
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

SnippetSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// ایندکس برای سرچ روی title و tags
// SnippetSchema.index({ title: "text" });

const Snippet =
  mongoose.models.Snippet || mongoose.model("Snippet", SnippetSchema);
export default Snippet;
