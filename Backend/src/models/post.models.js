import { model, Schema } from "mongoose";

const postSchema = new Schema({
    content: {
        type: String,
        trim: true,
        required: true
    },
    attachment: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

}, {
    timestamps: true,
});

export const Post = model("Post", postSchema)