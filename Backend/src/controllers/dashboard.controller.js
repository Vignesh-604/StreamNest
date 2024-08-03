import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js"
import mongoose from "mongoose";

// Get the channel stats like total video views, total subscribers, total videos, total likes etc.
const getChannelStats = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!channelId) throw new ApiError(400, "No channel ID mentioned")

    try {
        const stats = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "owner",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes"
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "owner",
                    foreignField: "owner",
                    as: "posts"
                }
            },
            {
                $lookup: {
                    from: "playlists",
                    localField: "owner",
                    foreignField: "owner",
                    as: "playlists"
                }
            },
            {
                $group: {
                    _id: null,
                    totalVideos: { $sum: 1, },
                    totalLikes: { $sum: { $size: "$likes" }},
                    // $size -> gives array of amount of likes in each video, $sum -> adds it all upto give total
                    totalPosts: { $first: { $size: "$posts" }},
                    totalPlaylists: { $first: { $size: "$playlists" }},
                    totalSubscribers: { $first: { $size: "$subscribers" } },
                    // gets subscriber count from first video document since all videos have same subscriber count
                    totalViews: { $sum: "$views" },
    
                    // likes: { $push: "$likes"},   // use $push to send an entire field (no use just for ref)
                }
            },
            {
                $project: {
                    _id: 0,
                    totalVideos: 1,
                    totalLikes: 1,
                    totalPosts: 1,
                    totalPlaylists: 1,
                    totalSubscribers: 1,
                    totalViews: 1,
                    // likes: 1,
                }
            },
            {
                $addFields: {
                    totalVideos: { $ifNull: ["$totalVideos", 0] },
                    totalLikes: { $ifNull: ["$totalLikes", 0] },
                    totalPosts: { $ifNull: ["$totalPosts", 0] },
                    totalPlaylists: { $ifNull: ["$totalPlaylists", 0] },
                    totalSubscribers: { $ifNull: ["$totalSubscribers", 0] },
                    totalViews: { $ifNull: ["$totalViews", 0] },
                }
            }
        ])
        
        const statsWithDefaults = stats.length > 0 ? stats[0] : {
            totalVideos: 0,
            totalLikes: 0,
            totalPosts: 0,
            totalPlaylists: 0,
            totalSubscribers: 0,
            totalViews: 0
        }

        res.status(200).json(new ApiResponse(200, statsWithDefaults, "Stats fetched"))
        
    } catch (error) {
        res.status(500).json(new ApiResponse(500, error, "Something went wrong"))
    }
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!channelId) throw new ApiError(400, "No channel ID mentioned")

    const videos = await Video.find({ owner: channelId })

    res.status(200).json(new ApiResponse(200, videos, "Videos fetched"))
})

export { getChannelStats, getChannelVideos }