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

    res.status(200).json(new ApiResponse(200, post, "Posted successfully"))
})

// Get post based on postId
// Find by id and update
const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    if (!postId) throw new ApiError(402, "No post id found")

    const { content } = req.body
    if (!content.trim()) throw new ApiError(402, "Enter your post content")

    const post = await Post.findByIdAndUpdate(
        postId,
        { $set: { content } },
        { new: true}
    )

    res.status(201).json( new ApiResponse(201, post, "Post updated successfully!"))
})

// Get post id and delete
const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    if (!postId) throw new ApiError(402, "No post id found")

    await Post.findByIdAndDelete("6697926628ea7ca31cb73734")

    res.status(201).json( new ApiResponse(201, "", "Post updated successfully!"))
})

// Get userId from params
const getUserPosts = asyncHandler(async (req, res) => {

    const {userId} = req.params
    if (!userId.trim()) throw new ApiError(403, "No userId")

    const posts = await Post.find({ owner: userId }).select("content updatedAt")
    // const posts = await Post.aggregate([
    //     {
    //         $match: {
    //             owner: new mongoose.Types.ObjectId(userId)
    //         }
    //     },
    //     {
    //         $lookup: {

    //         }
    //     }
    // ])
    if (!posts) throw new ApiError(404, "No posts found")

    res.status(203).json(new ApiResponse(200, posts, "Posts fetched successfully"))
})

export {
    createPost,
    updatePost,
    deletePost,
    getUserPosts,
}
