import mongoose from "mongoose";

type ArticleTag = {
  _id: mongoose.Types.ObjectId;
  title: string;
}

const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      required: true,
    },
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      select: '_id title',
    }],
  },
  {
    timestamps: true,
  }
);


type Article = mongoose.Document & {
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  status: "draft" | "published";
  tags: ArticleTag[];
  createdAt: Date;
  updatedAt: Date;
}

const Article = mongoose.model<Article>("Article", ArticleSchema);

export default Article; 