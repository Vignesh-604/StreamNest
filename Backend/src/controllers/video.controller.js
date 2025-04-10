import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js"
import { User } from "../models/user.models.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Purchase } from "../models/purchase.model.js";

const publishVideo = asyncHandler(async (req, res) => {
    let { title, description } = req.body
    if (!description) throw new ApiError(400, "Please put description")
    
    // Check user's upload limit
    const user = await User.findById(req.user?._id)
    if (!user) throw new ApiError(404, "User not found")

    if (user.uploads.uploaded >= user.uploads.uploadLimit) {
        throw new ApiError(403, "Upload limit reached")
    }

    if (!title) title = req.files?.videoFile[0]?.originalname?.split(".")[0]

    const videoFilePath = req.files?.videoFile[0]?.path
    if (!videoFilePath) throw new ApiError(400, "Video file is required")

    const thumbnailPath = req.files?.thumbnail[0]?.path
    if (!thumbnailPath) throw new ApiError(400, "Thumbnail Image is required")

    const videoFile = await uploadOnCloudinary(videoFilePath, "video")
    const thumbnail = await uploadOnCloudinary(thumbnailPath, "thumbnail")

    if (!videoFile) throw new ApiError(400, "Video file not found")
    if (!thumbnail) throw new ApiError(400, "Thumbnail not found")

    let videoDetails = {
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: req.user?._id
    }

    if (req.body.isExclusive) {
        let { isExclusive, price } = req.body

        isExclusive = isExclusive === "true" || isExclusive === true;

        if (isExclusive && (!price || isNaN(price) || price <= 4)) {
            throw new ApiError(400, "Price must be a valid number for exclusive videos");
        }
        if (isExclusive) {
            videoDetails["isExclusive"] = isExclusive
            videoDetails["price"] = price
        }
    }

    const video = await Video.create(videoDetails)
    if (!video) throw new ApiError(400, "Could not upload video")

    // Increment upload count
    await User.findByIdAndUpdate(req.user?._id, {
        $inc: { "uploads.uploaded": 1 }
    })

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

        const thumbnail = await uploadOnCloudinary(thumbnailPath, "thumbnail")
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

    // Decrease uploaded count, ensuring it doesn't go below zero
    await User.findByIdAndUpdate(video.owner, {
        $inc: { "uploads.uploaded": -1 }
    })

    res.status(203).json(new ApiResponse(201, { deleteVidFromCloud, deleteThumbnailFromCloud }, "video deleted successfully"))
})

const getEditDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Video id required")

    const details = await Video.findById(videoId).select("title description thumbnail owner")
    if (!details) throw new ApiError(501, "Couldn't get details")

    return res.status(200).json(new ApiResponse(200, details, "Details fetched"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Video id required")

    // **Step 1: Get only _id and isExclusive to check access**
    const videoMeta = await Video.findById(videoId).select("_id isExclusive owner").lean()
    if (!videoMeta) throw new ApiError(404, "Video not found")

    // Step 2: If exclusive, check if the user has purchased it OR bypass if user is the owner
    if (videoMeta.isExclusive && videoMeta.owner.toString() !== req.user._id.toString()) {
        const hasAccess = await Purchase.findOne({
            _id: req.user._id,
            "purchasedVideos.videoId": videoId
        }).lean()

        if (!hasAccess) {
            return res.status(401).json(new ApiResponse(401, "No access to this video"))
        }
    }

    // **Step 3: Perform aggregation to get full details**
    const video = await Video.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(videoId) }
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
            $lookup: {
                from: "subscriptions",
                localField: "owner._id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $addFields: {
                likes: { $size: "$likes" },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                },
                subscribers: { $size: "$subscribers" },
                owner: { $first: "$owner" },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
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
                price: 1,
                isExclusive: 1,
                likes: 1,
                isLiked: 1,
                subscribers: 1,
                isSubscribed: 1,
                owner: {
                    _id: 1,
                    fullname: 1,
                    username: 1,
                    avatar: 1
                }
            }
        }
    ])

    if (!video || !video.length) throw new ApiError(400, "Didn't work")

    const videoData = video[0]

    // **Step 4: Increment views count**
    await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true }
    ).select("views")

    res.status(201).json(new ApiResponse(201, videoData, "Video fetched successfully"))
})

const getAllVideos = asyncHandler(async (req, res) => {
    let { page = 1, limit = 12, query, sortBy, sortType, name } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    page = Math.max(1, page);
    limit = Math.min(20, Math.max(1, limit));

    const pipeline = [];

    // Search query (Regex instead of $text search)
    if (query) {
        pipeline.push({
            $match: {
                title: { $regex: query, $options: "i" } // Case-insensitive title search
            }
        });
    }

    // Search by user fullname/username (Regex search)
    if (name) {
        if (typeof name !== "string") throw new ApiError(401, "Invalid username or fullname");

        const users = await User.find({
            $or: [
                { fullname: { $regex: name, $options: "i" } },
                { username: { $regex: name, $options: "i" } }
            ]
        }).select("_id");

        if (users.length > 0) {
            const userIds = users.map(user => user._id);
            pipeline.push({
                $match: {
                    owner: { $in: userIds }
                }
            });
        }
    }

    // Clone the pipeline for total count calculation
    const totalCountPipeline = [...pipeline];

    // Sorting by field in asc/desc order
    const sortCategory = {};
    if (sortBy && (sortType === "asc" || sortType === "desc")) {
        sortCategory[sortBy] = sortType === "asc" ? 1 : -1;
    } else {
        sortCategory["createdAt"] = -1;
    }
    pipeline.push({ $sort: sortCategory });

    // Pagination
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    // Lookup user details
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
                {
                    $project: { fullname: 1, username: 1, avatar: 1 }
                }
            ]
        }
    });

    const videos = await Video.aggregate(pipeline);

    // Get total count
    totalCountPipeline.push({ $count: "total" });
    const total = await Video.aggregate(totalCountPipeline);

    if (!videos.length) {
        return res.status(200).json(new ApiResponse(200, [], `No videos found for '${query || name || ""}'`));
    }

    res.status(200).json(new ApiResponse(200, { videos, total }, "Videos fetched successfully"));
});

export {
    publishVideo,
    updateVideo,
    deleteVideo,
    getEditDetails,
    getVideoById,
    getAllVideos,
}