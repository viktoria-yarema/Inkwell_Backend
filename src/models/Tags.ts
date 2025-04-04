import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TagSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Tag = mongoose.model("Tag", TagSchema);

export default Tag;
