import { Schema, model } from 'mongoose';

const watchHistorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: true

    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video', required: true

    },
    watchedAt: {
        type: Date,
        default: Date.now
    },
});

export const WatchHistory = model('WatchHistory', watchHistorySchema);
