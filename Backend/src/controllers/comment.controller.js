import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.models.js"
import mongoose from "mongoose";

// Not optimized code. May change in future
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) throw new ApiError(402, "Provide a video Id");

    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const comments = await Comment.aggregate([
        {
            $match: { video: new mongoose.Types.ObjectId(videoId) }
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
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
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
                owner: { $first: "$owner" }
            }
        },
        {
            $project: {
                content: 1,
                video: 1,
                owner: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                },
                likes: 1,
                isLiked: 1,
                createdAt: 1,
                updatedAt: 1
            }
        },
        { $skip: skip },
        { $limit: parseInt(limit, 10) }
    ]);

    res.status(200).json(new ApiResponse(200, comments, "Video comments fetched"));
});

const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new ApiError(402, "Provide a post Id");

    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const comments = await Comment.aggregate([
        {
            $match: { post: new mongoose.Types.ObjectId(postId) }
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
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
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
                owner: { $first: "$owner" }
            }
        },
        {
            $project: {
                content: 1,
                post: 1,
                owner: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                },
                likes: 1,
                isLiked: 1,
                createdAt: 1,
                updatedAt: 1
            }
        },
        { $skip: skip },
        { $limit: parseInt(limit, 10) }
    ]);

    res.status(200).json(new ApiResponse(200, comments, "Post comments fetched"));
});


const addVideoComment = asyncHandler( async (req, res) => {
    const { videoId } = req.params
    if (!videoId) throw new ApiError(402, "No Video ID")

    const { content } = req.body
    if (!content) throw new ApiError(403, "No content")

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    })
    if (!comment) throw new ApiError(500, "Something went wrong while adding your comment")

    res.status(202).json( new ApiResponse(201, comment, "Comment added to video successfully"))
})

const addPostComment = asyncHandler( async (req, res) => {
    const { postId } = req.params
    if (!postId) throw new ApiError(402, "No post ID")

    const { content } = req.body
    if (!content) throw new ApiError(40, "No content")

    const comment = await Comment.create({
        content,
        post: postId,
        owner: req.user?._id
    })
    if (!comment) throw new ApiError(500, "Something went wrong while adding your comment")

    res.status(202).json( new ApiResponse(201, comment, "Comment added to post successfully"))
})

const updateComment = asyncHandler( async (req, res) => {
    const { commentId } = req.params
    if (!commentId) throw new ApiError(402, "No comment ID")

    const { content } = req.body
    if (!content) throw new ApiError(403, "No content")

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content }},
        { new: true }
    )

    res.status(203).json( new ApiResponse(201, comment, "Comment updated successfully"))
})

const removeComment = asyncHandler( async (req, res) => {
    const { commentId } = req.params
    if (!commentId) throw new ApiError(402, "No comment ID")

    await Comment.findByIdAndDelete(commentId)

    res.status(203).json( new ApiResponse(201, "", "Comment deleted successfully"))
})

export {
    getVideoComments,
    getPostComments,
    addVideoComment,
    addPostComment,
    updateComment,
    removeComment
}