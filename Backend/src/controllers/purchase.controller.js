import { Purchase } from "../models/purchase.model.js"
import { Video } from "../models/video.models.js"
import { Playlist } from "../models/playlist.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose, { isValidObjectId } from "mongoose";

const videoInfo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    // Step 1: Get video meta info (_id, isExclusive, owner)
    const videoMeta = await Video.findById(videoId).select("_id isExclusive owner").lean();
    if (!videoMeta) throw new ApiError(404, "Video not found");

    // Step 2: If exclusive, check if user has purchased it OR if they are the owner
    let hasAccess = false;

    if (videoMeta.isExclusive) {
        if (videoMeta.owner.toString() === userId.toString()) {
            hasAccess = true; // Owner has access
        } else {
            const purchase = await Purchase.findOne({
                _id: userId,
                "purchasedVideos.videoId": videoId
            }).lean();
            hasAccess = !!purchase;
        }
    } else {
        hasAccess = true; // Non-exclusive videos are accessible by default
    }

    // Step 3: If user has no access, return appropriate response
    if (!hasAccess) {
        return res.status(200).json(new ApiResponse(200, { hasAccess: false }, "Video is exclusive and not purchased"));
    }

    // Step 4: Fetch full video details if the user has access
    const video = await Video.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $addFields: { owner: { $first: "$owner" } } },
        {
            $project: {
                title: 1,
                description: 1,
                thumbnail: 1,
                createdAt: 1,
                duration: 1,
                views: 1,
                price: 1,
                isExclusive: 1,
                owner: {
                    _id: 1,
                    fullname: 1,
                    username: 1,
                    avatar: 1
                }
            }
        }
    ]);

    if (!video || !video.length) throw new ApiError(400, "Video data retrieval failed");

    res.status(200).json(new ApiResponse(200, { hasAccess: true, video: video[0] }, "Video details fetched successfully"));
});

const buyVideo = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { videoId } = req.params

    const video = await Video.findById(videoId).select(" _id isExclusive price ")
    if (!video) return res.status(404).json(new ApiResponse(404, "Video not found"))
    if (!video.isExclusive) return res.status(400).json(new ApiResponse(400, "This video is not exclusive"))

    const purchase = await Purchase.findById(userId)
    if (purchase?.purchasedVideos.some(v => v.videoId.toString() === videoId)) {
        return res.status(400).json(new ApiResponse(400, "Video already purchased"))
    }

    const videoPrice = video.price

    if (purchase) {
        purchase.purchasedVideos.push({ videoId, amount: videoPrice })
        purchase.totalAmount += videoPrice
        await purchase.save()
    } else {
        await Purchase.create({
            _id: userId,
            purchasedVideos: [{ videoId, amount: videoPrice }],
            totalAmount: videoPrice
        })
    }

    res.status(200).json(new ApiResponse(200, purchase, "Video purchased successfully"))
})

const buyPlaylist = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { playlistId } = req.params

    const playlist = await Playlist.findById(playlistId).populate("videos", "_id isExclusive price")
    if (!playlist) return res.status(404).json(new ApiResponse(404, "Playlist not found"))
    if (!playlist.isExclusive) return res.status(400).json(new ApiResponse(400, "This playlist is not exclusive"))

    const purchase = await Purchase.findById(userId)
    if (purchase?.purchasedPlaylists.includes(playlistId)) {
        return res.status(400).json(new ApiResponse(400, "Playlist already purchased"))
    }

    const playlistPrice = playlist.price

    const videosToAdd = playlist.videos
        .filter(v => v.isExclusive && !purchase?.purchasedVideos.some(pv => pv.videoId.toString() === v._id.toString()))    // exclusive and unpurchased
        .map(v => ({ videoId: v._id, playlistId }))        // Transforms each filtered video into an object

    if (purchase) {
        purchase.purchasedPlaylists.push({
            playlistId,
            purchasedAt: new Date(),
            amount: playlistPrice
        })
        purchase.purchasedVideos.push(...videosToAdd)
        purchase.totalAmount += playlistPrice
        await purchase.save()
    } else {
        await Purchase.create({
            _id: userId,
            purchasedPlaylists: [{
                playlistId,
                purchasedAt: new Date(),
                amount: playlistPrice
            }],
            purchasedVideos: videosToAdd,
            totalAmount: playlistPrice
        })
    }

    res.status(200).json(new ApiResponse(200, purchase, "Playlist purchased successfully"))
})

const getPurchaseHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const purchase = await Purchase.findOne({ _id: userId })
        .populate({
            path: "purchasedVideos.videoId",
            select: "title thumbnail duration owner",
            populate: {
                path: "owner",
                select: "fullname username avatar"
            }
        })
        .populate({
            path: "purchasedVideos.playlistId",
            select: "name owner",
            populate: {
                path: "owner",
                select: "fullname username avatar"
            }
        })
        .populate({
            path: "purchasedPlaylists.playlistId",
            select: "name poster owner",
            populate: {
                path: "owner",
                select: "fullname username avatar"
            }
        })
        .populate("purchasedUploads") // Fetch purchased uploads
        .lean()

    if (!purchase) {
        return res.status(404).json(new ApiResponse(404, "No purchases found"))
    }

    res.status(200).json(new ApiResponse(200, purchase, "Purchase history retrieved"))
})

const buyUploadSlots = asyncHandler(async (req, res) => {
    const { uploadCount } = req.params
    if (!uploadCount || uploadCount <= 0) return res.status(404).json(new ApiResponse(400, "Invalid upload count"))

    const user = await User.findById(req.user?._id)
    if (!user) return res.status(404).json(new ApiResponse(404, "User not found"))

    // Assume price per upload slot is fixed (or fetched dynamically)
    const amount = uploadCount * PRICE_PER_UPLOAD_SLOT

    // Update purchase history
    await Purchase.findByIdAndUpdate(
        req.user._id,
        {
            $push: { purchasedUploads: { uploadCount, amount, purchasedAt: new Date() } }
        },
        { upsert: true, new: true }
    )

    // Increase upload limit
    await User.findByIdAndUpdate(req.user?._id, {
        $inc: { "uploads.uploadLimit": uploadCount }
    })

    res.status(200).json(new ApiResponse(200, `${uploadCount} uploads purchased`))
})


export {
    videoInfo,
    buyVideo,
    buyPlaylist,
    getPurchaseHistory,
    buyUploadSlots,
}