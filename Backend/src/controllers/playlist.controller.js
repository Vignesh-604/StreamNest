import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.models.js"
import { Video } from "../models/video.models.js"
import mongoose from "mongoose";
import { Purchase } from "../models/purchase.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const owner = req.user?._id
    if (!owner) throw new ApiError(404, "No owner found")

    const { name, description } = req.body
    if (!name) throw new ApiError(404, "Name or description not found")

    let playlistDetails = {
        name,
        description,
        owner
    }

    if (req.body.isExclusive) {
        let { isExclusive, price } = req.body

        isExclusive = isExclusive === "true" || isExclusive === true;

        if (isExclusive && (!price || isNaN(price) || price <= 4)) {
            throw new ApiError(400, "Price must be a valid number for exclusive playlists");
        }
        if (isExclusive) {
            playlistDetails["isExclusive"] = isExclusive
            playlistDetails["price"] = price
        }
    }

    const playlist = await Playlist.create(playlistDetails)

    res.status(200).json(new ApiResponse(200, playlist, "Playlist created successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId) throw new ApiError(402, "No playlist ID found")

    await Playlist.findByIdAndDelete(playlistId)

    res.status(200).json(new ApiResponse(200, "", "Playlist deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId) throw new ApiError(402, "No playlist ID found")

    const { name, description } = req.body
    if (!name || !description) throw new ApiError(404, "Name or description empty")

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: { name, description }
        },
        { new: true }
    )
    res.status(200).json(new ApiResponse(200, updatedPlaylist, "Playlist updated"))
})

const addVideo = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params
    if (!(videoId && playlistId)) throw new ApiError(402, "Parameters missing")

    const playlist = await Playlist.findById(playlistId)
    playlist.videos.push(new mongoose.Types.ObjectId(videoId))
    const updatedPlaylist = await playlist.save({ validateBeforeSave: false })

    res.status(200).json(new ApiResponse(200, updatedPlaylist, "Added video"))
})

const removeVideo = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params
    if (!(videoId && playlistId)) throw new ApiError(404, "Parameters missing")

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new ApiError(404, "Playlist not found")

    playlist.videos = playlist.videos.filter(item => item._id != videoId)
    const updatedPlaylist = await playlist.save({ validateBeforeSave: false })

    res.status(202).json(new ApiResponse(202, updatedPlaylist, "Removed video"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!userId) throw new ApiError(402, "No user ID found")

    const userPlaylists = await Playlist.find({ owner: userId })

    for (let obj of userPlaylists) {
        obj["poster"] = (await Video.findById(obj.videos[0]).select("thumbnail"))
    }

    res.status(201).json(new ApiResponse(201, userPlaylists, "User Playlists fetched"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId) throw new ApiError(404, "No playlist ID found");

    let playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                        },
                    },
                    {
                        $unwind: "$owner",
                    },
                    {
                        $project: {
                            title: 1,
                            description: 1,
                            thumbnail: 1,
                            views: 1,
                            isExclusive: 1,
                            price: 1,
                            duration: 1,
                            owner: {
                                _id: 1,
                                fullname: 1,
                                username: 1,
                                avatar: 1,
                            },
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $unwind: "$owner",
        },
        {
            $project: {
                name: 1,
                description: 1,
                updatedAt: 1,
                isExclusive: 1,
                price: 1,
                videos: 1,
                owner: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                },
            },
        },
    ]);
    if (!playlist.length) throw new ApiError(404, "Couldn't aggregate or playlist missing.");

    let access = false;
    if (playlist[0].isExclusive) {
        const purchase = await Purchase.findOne({ _id: req.user._id });
        if (purchase?.purchasedPlaylists.some(p => p.playlistId.toString() === playlistId.toString())) {
            access = true;
        }
    }
    playlist = playlist[0];

    res.status(200).json(new ApiResponse(200, { playlist, access }, "Playlist fetched"));
});

export {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addVideo,
    removeVideo,
    getUserPlaylists,
    getPlaylistById
}