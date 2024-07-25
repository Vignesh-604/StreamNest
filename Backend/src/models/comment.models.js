import { model, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        index: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        index:true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },

}, {
    timestamps: true,
});

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = model("Comment", commentSchema)