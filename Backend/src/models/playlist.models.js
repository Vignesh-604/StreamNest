import { Schema, model } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    poster: {
        type: {
            _id: String,
            thumbnail: String
        }
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isExclusive: { type: Boolean, default: false },
    price: { type: Number },  
}, {
    timestamps: true,
});

export const Playlist = model('Playlist', playlistSchema);