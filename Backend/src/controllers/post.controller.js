import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.models.js"
import mongoose from "mongoose";

// Get content from frontend and userID from req.user
// Create post object in db
const createPost = asyncHandler(async (req, res) => {
    const { content } = req.body
    if (!content.trim()) throw new ApiError(402, "Enter your post content")

    const owner = req.user?._id
    if (!owner) throw new ApiError(404, "No owner found")

    const post = await Post.create({
        content, owner
    })

    res.status(201).json(new ApiResponse(201, post, "Posted successfully"))
})

// Get post based on postId
// Find by id and update
const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    if (!postId) throw new ApiError(404, "No post id found")

    const { content } = req.body
    if (!content.trim()) throw new ApiError(400, "Enter your post content")

    const post = await Post.findByIdAndUpdate(
        postId,
        { $set: { content } },
        { new: true }
    )

    res.status(200).json(new ApiResponse(200, post, "Post updated successfully!"))
})

// Get post id and delete
const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    if (!postId) throw new ApiError(402, "No post id found")

    await Post.findByIdAndDelete(postId)

    res.status(200).json(new ApiResponse(200, "", "Post deleted successfully!"))
})

// Get userId from params
const getUserPosts = asyncHandler(async (req, res) => {

    const { userId } = req.params
    if (!userId) throw new ApiError(404, "No userId")

    // const posts = await Post.find({ owner: userId }).select("content updatedAt")
    const posts = await Post.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likes"
            }
        },
        {
            $addFields: {
                likes: {
                    $size: "$likes"
                },
                comments: {
                    $size: "$comments"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                content: 1,
                updatedAt: 1,
                likes: 1,
                comments: 1,
                isLiked: 1,
            }
        },
        {
            $sort : {
                updatedAt: -1
            }
        }
    ])
    if (!posts) throw new ApiError(404, "No posts found")

    res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"))
})

const getPostById = asyncHandler(async (req, res) => {

    const { postId } = req.params
    if (!postId) throw new ApiError(403, "No postId")

    const post = await Post.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(postId)
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
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likes"
            }
        },
        {
            $addFields: {
                likes: {
                    $size: "$likes"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                content: 1,
                updatedAt: 1,
                likes: 1,
                isLiked: 1,
                owner: {
                    _id :1,
                    username: 1,
                    fullname: 1,
                    avatar: 1
                }
            }
        }
    ])
    if (!post) throw new ApiError(400, "Couldn't fetch")

    res.status(200).json(new ApiResponse(200, post[0], "Post details fetched"))
})

export {
    createPost,
    updatePost,
    deletePost,
    getUserPosts,
    getPostById,
}
