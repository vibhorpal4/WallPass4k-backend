import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
const options = { separator: "-", lang: "eng", truncate: 1 };
mongoose.plugin(slug, options);

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      slug: "title",
    },
    author: {
      type: String,
      ref: "User",
    },
    image: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Image",
    },
    dateCreated: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
