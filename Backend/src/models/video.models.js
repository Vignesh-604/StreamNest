import {Schema, model} from "mongoose";

const videoSchema = new Schema({
    videoFile: {
        type: String,               // cloudinary url
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        index:"text"
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,               // cloudinary url
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    isExclusive: { type: Boolean, default: false }, 
    price: { type: Number },
},{
    timestamps: true
});

// videoSchema.index({ title: 'text', description: 'text' });
videoSchema.index({createdAt: true, updatedAt: true})

export const Video = model('Video', videoSchema);