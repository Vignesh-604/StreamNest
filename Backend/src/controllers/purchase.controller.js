import { Purchase } from "../models/purchase.model.js"
import { Video } from "../models/video.models.js"
import { Playlist } from "../models/playlist.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const videoSale = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { videoId } = req.params

    const video = await Video.findById(videoId).select(" _id isExclusive price ")
    if (!video) return res.status(404).json(new ApiResponse(404, "Video not found"))
    if (!video.isExclusive) return res.status(400).json(new ApiResponse(400, "This video is not exclusive"))

    const purchase = await Purchase.findById(userId)
    if (purchase?.purchasedVideos.some(v => v.videoId.toString() === videoId)) {
        return res.status(400).json(new ApiResponse(400, "Video already purchased"))
    }

    return res.status(200).json(new ApiResponse(200, true, "Video not bought"))
})

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
    const { userId } = req.user
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
        purchase.purchasedPlaylists.push(playlistId)
        purchase.purchasedVideos.push(...videosToAdd)
        purchase.totalAmount += playlistPrice
        await purchase.save()
    } else {
        await Purchase.create({
            user: userId,
            purchasedPlaylists: [playlistId],
            purchasedVideos: videosToAdd,
            totalAmount: playlistPrice
        })
    }

    res.status(200).json(new ApiResponse(200, purchase, "Playlist purchased successfully"))
})

const getPurchaseHistory = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const purchase = await Purchase.findOne({ user: userId })
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
        .lean()

    if (!purchase) {
        return res.status(404).json(new ApiResponse(404,"No purchases found"))
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

    res.status(200).json(new ApiResponse(200,`${uploadCount} uploads purchased`))
})


export {
    videoSale,
    buyVideo,
    buyPlaylist,
    getPurchaseHistory,
    buyUploadSlots,
}