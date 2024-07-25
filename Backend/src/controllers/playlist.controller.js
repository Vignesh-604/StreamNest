import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.models.js"
import mongoose from "mongoose";

const createPlaylist = asyncHandler( async (req, res) => {
    const owner = req.user?._id
    if (!owner) throw new ApiError(404, "No owner found")

    const {name, description} = req.body
    if (!name) throw new ApiError(404, "Name or description not found")
    
    const playlist = await Playlist.create({
        name,
        description,
        owner
    })

    res.status(200).json( new ApiResponse(200, playlist, "Playlist created successfully"))
})

const deletePlaylist = asyncHandler( async (req, res) => {
    const {playlistId} = req.params
    if (!playlistId) throw new ApiError(402, "No playlist ID found")

    await Playlist.findByIdAndDelete(playlistId)

    res.status(203).json( new ApiResponse(203, "", "Playlist deleted"))
})

const updatePlaylist = asyncHandler( async (req, res) => {
    const {playlistId} = req.params
    if (!playlistId) throw new ApiError(402, "No playlist ID found")
    
    const {name, description} = req.body
    if (!name || !description) throw new ApiError(404, "Name or description empty")

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {name, description}
        },
        { new: true}
    )
    res.status(202).json( new ApiResponse(202, updatePlaylist, "Playlist updated"))
})

const addVideo = asyncHandler( async (req, res) => {
    const {videoId, playlistId} = req.params
    if (!(videoId && playlistId)) throw new ApiError(402, "Parameters missing")

    const playlist = await Playlist.findById(playlistId)
    playlist.videos.push(new mongoose.Types.ObjectId(videoId))
    const updatedPlaylist= await playlist.save({ validateBeforeSave: false })

    res.status(201).json( new ApiResponse(201, updatePlaylist, "Added video"))
})

const removeVideo = asyncHandler( async (req, res) => {
    const {videoId, playlistId} = req.params
    if (!(videoId && playlistId)) throw new ApiError(402, "Parameters missing")

    const playlist = await Playlist.findById(playlistId)
    playlist.videos = playlist.videos.filter(item => item._id != videoId)
    const updatedPlaylist= await playlist.save({ validateBeforeSave: false })
    
    res.status(202).json( new ApiResponse(202, updatePlaylist, "Removed video"))
})

const getUserPlaylists = asyncHandler( async (req, res) => {
    const {userId} = req.params
    if (!userId) throw new ApiError(402, "No user ID found")

    const userPlaylists = await Playlist.find({ owner: userId})

    res.status(201).json( new ApiResponse(201, userPlaylists, "User Playlists fetched"))
})

const getPlaylistById = asyncHandler( async (req, res) => {
    const {playlistId} = req.params
    if (!playlistId) throw new ApiError(402, "No playlist ID found")

    const playlist = await Playlist.findById(playlistId)
    res.status(200).json( new ApiResponse(200, playlist, "Playlist fetched"))
})

export {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addVideo,
    removeVideo,
    getUserPlaylists,
    getPlaylistById
}