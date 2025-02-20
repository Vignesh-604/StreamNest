import { Schema, model } from "mongoose";

const purchaseSchema = new Schema({
    // userId is used as _id
    _id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    purchasedVideos: [
        {
            videoId: { type: Schema.Types.ObjectId, ref: "Video", required: true },
            amount: { type: Number },
            playlistId: { type: Schema.Types.ObjectId, ref: "Playlist" },
            purchasedAt: { type: Date }
        }
    ],
    purchasedPlaylists: [
        {
            playlistId: { type: Schema.Types.ObjectId, ref: "Playlist", required: true },
            amount: { type: Number, required: true },
            purchasedAt: { type: Date, default: Date.now }
        }
    ],
    purchasedUploads: [
        {
            uploadCount: { type: Number, required: true },
            amount: { type: Number, required: true },
            purchasedAt: { type: Date, default: Date.now }
        }
    ]
}, { _id: false }); // Disable default _id

export const Purchase = model("Purchase", purchaseSchema)