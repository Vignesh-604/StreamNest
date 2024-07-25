import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.models.js"

const toggleCommentLike = asyncHandler( async (req, res) => {
    const {commentId} = req.params
    if (!commentId?.trim()) throw new ApiError(401, "No commentID")

    const user = req.user?._id
    if (!user) throw new ApiError(404, "No user found")

    let commentLike = await Like.findOne({
        likedBy: user,
        comment: commentId
    })

    if (commentLike) {
        await Like.findOneAndDelete({
            likedBy: user,
            comment: commentId
        })
        if (!commentLike) throw new ApiError(402, "Could not dislike comment")

        res.status(202).json( new ApiResponse(202, "", "Comment like removed"))
    } else {
        commentLike = await Like.create({
            likedBy: user,
            comment: commentId
        })
        if (!commentLike) throw new ApiError(402, "Could not likecomment")

        res.status(202).json( new ApiResponse(202,commentLike, "Comment liked"))
    }
})

// Toggle post like
const togglePostLike = asyncHandler( async (req, res) => {
    const {postId} = req.params
    if (!postId?.trim()) throw new ApiError(401, "No postID")

    const user = req.user?._id
    if (!user) throw new ApiError(404, "No user found")

    let postLike = await Like.findOne({
        likedBy: user,
        post: postId
    })

    if (postLike) {
        await Like.findOneAndDelete({
            likedBy: user,
            post: postId
        })
        if (!postLike) throw new ApiError(402, "Could not dislike post")

        res.status(200).json( new ApiResponse(200, "", "Post like removed"))
    } else {
        postLike = await Like.create({
            likedBy: user,
            post: postId
        })
        if (!postLike) throw new ApiError(402, "Could not like post")

        res.status(200).json( new ApiResponse(200,postLike, "Post liked"))
    }
})

// Toggle Video Like
const toggleVideoLike = asyncHandler( async (req, res) => {
    const {videoId} = req.params
    if (!videoId?.trim()) throw new ApiError(401, "No videoID")

    const user = req.user?._id
    if (!user) throw new ApiError(404, "No user found")

    let videoLike = await Like.findOne({
        likedBy: user,
        video: videoId
    })

    if (videoLike) {
        await Like.findOneAndDelete({
            likedBy: user,
            video: videoId
        })
        if (!videoLike) throw new ApiError(402, "Could not dislike Video")

        res.status(202).json( new ApiResponse(202, "", "video like removed"))
    } else {
        videoLike = await Like.create({
            likedBy: user,
            video: videoId
        })
        if (!videoLike) throw new ApiError(402, "Could not like Video")

        res.status(202).json( new ApiResponse(202,videoLike, "video liked"))
    }
})

const getLikedVideos = asyncHandler( async (req, res) => {
    const user = req.user
    
    const videos = await Like.find({
        likedBy: user,
        video: {$exists: true}
    })

    res.status(200).json( new ApiResponse(200, videos, "Liked videos fetched"))
})

export {
    toggleCommentLike,
    togglePostLike,
    toggleVideoLike,
    getLikedVideos
}