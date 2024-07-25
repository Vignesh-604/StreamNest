import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";

const publishVideo = asyncHandler(async (req, res) => {

    let { title, description } = req.body
    if (!description) throw new ApiError(401, "Please put description")

    if (!title) title = req.files?.videoFile[0]?.originalname?.split(".")[0]

    const videoFilePath = req.files?.videoFile[0]?.path
    if (!videoFilePath) throw new ApiError(400, "Video file is required")

    const thumbnailPath = req.files?.thumbnail[0]?.path
    if (!thumbnailPath) throw new ApiError(400, "Thumbnail Image is required")

    const videoFile = await uploadOnCloudinary(videoFilePath)
    const thumbnail = await uploadOnCloudinary(thumbnailPath)

    if (!videoFile) throw new ApiError(400, "Video file not found")
    if (!thumbnail) throw new ApiError(400, "Thumbnail not found")

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: req.user?._id
    })
    if (!video) throw new ApiError(400, "Could not upload video")

    res.status(200).json(new ApiResponse(200, video, "Video uploaded successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) throw new ApiError(400, "No video ID")

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(400, "No video found")

    const { title, description } = req.body
    if (title) video.title = title
    if (description) video.description = description

    if (req.file && req.file?.path) {
        const thumbnailPath = req.file?.path
        if (!thumbnailPath) throw new ApiError(400, "Cover Image file is missing")

        const thumbnail = await uploadOnCloudinary(thumbnailPath)
        if (!thumbnail) throw new ApiError(400, "Cover Image file is missing in cloudinary")

        const deleteOnCloud = await deleteFromCloudinary(video.thumbnail)

        video.thumbnail = thumbnail.url
    }

    const updatedVideo = await video.save({ validateBeforeSave: false })
    res.status(201).json(new ApiResponse(201, updatedVideo, "Video updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) throw new ApiError(402, "No video ID")

    const video = await Video.findByIdAndDelete(videoId)

    const deleteVidFromCloud = await deleteFromCloudinary(video.videoFile)
    const deleteThumbnailFromCloud = await deleteFromCloudinary(video.thumbnail)

    res.status(203).json(new ApiResponse(201, { deleteVidFromCloud, deleteThumbnailFromCloud }, "video deleted successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Video id required")

    const video = await Video.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(videoId)}
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
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $addFields: {
                likes: { 
                    $size: "$likes"
                },
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, "$likes.likedBy"]},
                        then: true,
                        else: false
                    }
                },
                owner: {
                    $first: "$owner"
                }
            },
        },
        {
            $project: {
                title: 1,
                description: 1,
                videoFile: 1,
                thumbnail: 1,
                createdAt: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                likes: 1,
                isLiked: 1,
                owner: {
                    fullname: 1,
                    username: 1,
                    avatar: 1
                }
            }
        }
    ])
    if (!video || !video.length) throw new ApiError(400, "Didn't work")

    // Increments views value 
    await Video.findByIdAndUpdate(
        videoId,
        { $inc: {views: 1}},
        {new: true}
    ).select("views")
    
    res.status(201).json(new ApiResponse(201, video, "Video fetched successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) throw new ApiError(400, "Video id required")

    const video = await Video.findByIdAndUpdate(
        videoId,
        // using aggregation pipeline to use $not and toggle the value in 1 handshake
        // alternative - isPublished: { $eq: ["$isPublished", false] } (if false then true or else false)
        [
            { $set: { isPublished: { $not: "$isPublished" } } },
        ],
        { new: true }
    )
    res.status(201).json(new ApiResponse(201, video, "Publish toggled"))
})

const getAllVideos = asyncHandler(async (req, res) => {

    let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    page = parseInt(page, 10)
    limit = parseInt(limit, 10)

    page = Math.max(1, page)        // min page number be 1
    limit = Math.min(20, Math.max(1, limit))    // Limit is between 1-20

    const pipeline = []

    if (query) {
        pipeline.push({
            $match: {                   // runs a text search on string fields like title, desc, etc
                $text: {
                    $search: query
                }
            }
        })
    }

    if (userId) {
        if (!isValidObjectId(userId)) throw new ApiError(401, "UserId incorrect")

        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }

    const sortCategory = {}
    if (sortBy && (sortType === "asc" || "desc")) {
        sortCategory[sortBy] = sortType === "asc" ? 1 : -1
    } else {
        sortCategory["createdAt"] = -1
    }
    pipeline.push({ $sort: sortCategory })

    pipeline.push({
        $skip: (page - 1) * limit
    })

    pipeline.push({
        $limit: limit
    })

    const videos = await Video.aggregate(pipeline)

    if (!videos || !videos.length) res.status(200).json(new ApiResponse(200, [], "No videos available"))

    else res.status(200).json( new ApiResponse(200, videos, "Videos fetched"))
})

export {
    publishVideo,
    updateVideo,
    deleteVideo,
    getVideoById,
    getAllVideos,
    togglePublishStatus
}