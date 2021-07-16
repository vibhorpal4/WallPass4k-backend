import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
const options = { separator: "-", lang: "eng", truncate: 1 };
mongoose.plugin(slug, options);

const ImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      ref: "Category",
    },
    tags: [String],
    author: {
      type: String,
      ref: "User",
    },
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Image", ImageSchema);
