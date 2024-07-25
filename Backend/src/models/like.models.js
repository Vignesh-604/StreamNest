import { Schema, model } from "mongoose";

const likeSchema = new Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        index: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        index: true
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
}, {
    timestamps: true,
});

export const Like = model('Like', likeSchema);