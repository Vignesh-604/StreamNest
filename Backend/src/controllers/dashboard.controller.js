import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js"
import mongoose from "mongoose";

// Get the channel stats like total video views, total subscribers, total videos, total likes etc.
const getChannelStats = asyncHandler(async (req, res) => {

    try {
        const stats = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(req.user?._id)
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
                $group: {
                    _id: null,
                    totalVideos: { $sum: 1, },
                    totalLikes: { $sum: { $size: "$likes" }},
                    // $size -> gives array of amount of likes in each video, $sum -> adds it all upto give total
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
                    totalSubscribers: 1,
                    totalViews: 1,
                    // likes: 1,
                }
            }
        ])
        if (!stats) throw new ApiError(400, "Couldn't fetch stats")
    
        res.status(200).json(new ApiResponse(200, stats, "Stats fetched"))
        
    } catch (error) {
        res.status(500).json(new ApiResponse(500, error, "Something went wrong"))
    }
})

const getChannelVideos = asyncHandler(async (req, res) => {

    const videos = await Video.find({ owner: req.user?._id })

    res.status(200).json(new ApiResponse(200, videos, "Videos fetched"))
})

export { getChannelStats, getChannelVideos }