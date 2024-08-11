import mongoose from "mongoose";
import { WatchHistory } from "../models/watchHistory.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const trackWatchHistory = asyncHandler(async (req, res) => {
    const user = req.user?._id

    const { video } = req.params
    if (!video) throw ApiError(404, "Video Id not found")

    // This code checks if a user has already watched a specific video on the current day; if not, it logs the watch event
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const exists = await WatchHistory.findOne({
        user,
        video,
        watchedAt: { $gte: startOfDay, $lt: endOfDay }  //checks if there's a record between the start and end of day
    });

    if (!exists) {
        const details = await WatchHistory.create({
            user, video
        })
        return res.status(201).json(new ApiResponse(201, details, "Video added to history"))
    }

    return res.status(200).json(new ApiResponse(200, "", "Video already exists."))

})


const deleteVideoFromHistory = asyncHandler(async (req, res) => {
    const { historyId } = req.params
    if (!historyId) throw ApiError(404, "WatchHistory Id not found")

    const deleted = await WatchHistory.findByIdAndDelete(historyId)
    if (!deleted) throw new ApiError(400, "Couldn't delete video")

    return res.status(204).json(new ApiResponse(204, "", "Video removed from watch history."))
})


const getUserWatchHistory = asyncHandler(async (req, res) => {
    const {userId } = req.params
    if (!userId) throw ApiError(404, "userId not found")

    // const userHistory = await WatchHistory.find({ user: userId })
    const userHistory = await WatchHistory.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                    $project: {
                        _id : 1,
                        title: 1,
                        description: 1,
                        thumbnail: 1,
                        duration: 1,
                        owner: 1
                    }
                }
            ]
            }
        }
    ])
    if (!userHistory) throw new ApiError(400, "Couldn't find user's watch history")

    return res.status(200).json(new ApiResponse(200, userHistory, "User's watch history fetched"))
})


const clearUserWatchHistory = asyncHandler(async (req, res) => {
    const {userId } = req.params
    if (!userId) throw ApiError(404, "userId not found")

    const userHistory = await WatchHistory.deleteMany({ user: userId })

    return res.status(200).json(new ApiResponse(200, userHistory, "Cleared user watch history."))
})

export {
    trackWatchHistory,
    deleteVideoFromHistory,
    getUserWatchHistory,
    clearUserWatchHistory,
}