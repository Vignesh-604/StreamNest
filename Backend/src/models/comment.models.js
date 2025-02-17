import { model, Schema } from "mongoose";

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

export const Comment = model("Comment", commentSchema)