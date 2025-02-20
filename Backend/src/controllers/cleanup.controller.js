import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { WatchHistory } from "../models/watchHistory.models.js";
import { Post } from "../models/post.models.js";
import { Like } from "../models/like.models.js";
import { Comment } from "../models/comment.models.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";

const cleanupVideos = async () => {
    // Find videos where owner doesn't exist anymore
    const videos = await Video.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $match: {
                owner: { $size: 0 }
            }
        }
    ]);

    let deletedCount = 0;
    let cloudinaryResults = [];

    // Delete videos and their associated files from cloudinary
    for (const video of videos) {
        // Delete from cloudinary
        if (video.videoFile) {
            const deleteVideoResult = await deleteFromCloudinary(video.videoFile);
            cloudinaryResults.push({ type: 'video', result: deleteVideoResult });
        }
        if (video.thumbnail) {
            const deleteThumbnailResult = await deleteFromCloudinary(video.thumbnail);
            cloudinaryResults.push({ type: 'thumbnail', result: deleteThumbnailResult });
        }

        // Delete from database
        await Video.findByIdAndDelete(video._id);
        deletedCount++;
    }

    return (cloudinaryResults, deletedCount)
}

// Deletes history of user who no longer exists or removes videos which no longer exists
const cleanupWatchHistory = async () => {
    const userHistoryResult = await WatchHistory.deleteMany({
        user: { $exists: true, $nin: await mongoose.model('User').distinct('_id') }
    });

    const videoHistoryResult = await WatchHistory.deleteMany({
        video: { $exists: true, $nin: await Video.distinct('_id') }
    });

    return { removedUserHistory: userHistoryResult.deletedCount, removedVideoHistory: videoHistoryResult.deletedCount, totalRemoved: userHistoryResult.deletedCount + videoHistoryResult.deletedCount };
};

// Deletes posts with no user (deleted user)
const cleanupPosts = async () => {
    const result = await Post.deleteMany({
        owner: { $exists: true, $nin: await mongoose.model('User').distinct('_id') }
    });

    return { removedPosts: result.deletedCount };
};

// Deletes Likes where: User, videos, post or coment doesn't exist
const cleanupLikes = async () => {
    const userLikesResult = await Like.deleteMany({
        likedBy: { $exists: true, $nin: await mongoose.model('User').distinct('_id') }
    });

    const videoLikesResult = await Like.deleteMany({
        video: { $exists: true, $nin: await Video.distinct('_id') }
    });

    const postLikesResult = await Like.deleteMany({
        post: { $exists: true, $nin: await Post.distinct('_id') }
    });

    const commentLikesResult = await Like.deleteMany({
        comment: { $exists: true, $nin: await Comment.distinct('_id') }
    });

    return {
        removedUserLikes: userLikesResult.deletedCount,
        removedVideoLikes: videoLikesResult.deletedCount,
        removedPostLikes: postLikesResult.deletedCount,
        removedCommentLikes: commentLikesResult.deletedCount,
        totalRemoved: userLikesResult.deletedCount + videoLikesResult.deletedCount + postLikesResult.deletedCount + commentLikesResult.deletedCount
    };
};

// Delete comment without video, post or user
const cleanupComments = async () => {
    const userCommentsResult = await Comment.deleteMany({
        owner: { $exists: true, $nin: await mongoose.model('User').distinct('_id') }
    });

    const videoCommentsResult = await Comment.deleteMany({
        video: { $exists: true, $nin: await Video.distinct('_id') }
    });

    const postCommentsResult = await Comment.deleteMany({
        post: { $exists: true, $nin: await Post.distinct('_id') }
    });

    return {
        removedUserComments: userCommentsResult.deletedCount,
        removedVideoComments: videoCommentsResult.deletedCount,
        removedPostComments: postCommentsResult.deletedCount,
        totalRemoved: userCommentsResult.deletedCount + videoCommentsResult.deletedCount + postCommentsResult.deletedCount
    };
};

// Removes subscription for missing subscriber or subscribed channel
const cleanupSubscriptions = async () => {
    const removedSubscriberSubs = await Subscription.deleteMany({
        subscriber: { $nin: await mongoose.model("User").distinct("_id") }
    });

    const removedChannelSubs = await Subscription.deleteMany({
        channel: { $nin: await mongoose.model("User").distinct("_id") }
    });

    return { totalRemoved: removedSubscriberSubs.deletedCount + removedChannelSubs.deletedCount };
};

// Call each function separately
const cleanupOrphanedVideos = asyncHandler(async (req, res) => {
    const { cloudinaryResults, deletedCount } = await cleanupVideos()

    res.status(200).json(new ApiResponse(200, { deletedVideos: deletedCount, cloudinaryResults }, "Orphaned videos cleanup completed successfully"));
});
const cleanupOrphanedWatchHistory = asyncHandler(async (req, res) => {
    const result = await cleanupWatchHistory();
    res.status(200).json(new ApiResponse(200, result, "Orphaned watch history cleanup completed successfully"));
});

const cleanupOrphanedPosts = asyncHandler(async (req, res) => {
    const result = await cleanupPosts();
    res.status(200).json(new ApiResponse(200, result, "Orphaned posts cleanup completed successfully"));
});

const cleanupOrphanedLikes = asyncHandler(async (req, res) => {
    const result = await cleanupLikes();
    res.status(200).json(new ApiResponse(200, result, "Orphaned likes cleanup completed successfully"));
});

const cleanupOrphanedComments = asyncHandler(async (req, res) => {
    const result = await cleanupComments();
    res.status(200).json(new ApiResponse(200, result, "Orphaned comments cleanup completed successfully"));
});

const cleanupOrphanedSubscriptions = asyncHandler(async (req, res) => {
    const result = await cleanupSubscriptions();
    res.status(200).json(new ApiResponse(200, result, "Orphaned subscriptions cleanup completed successfully"));
});


// Execute all cleanup operations in specific order:
// 1. First clean up videos and posts (main contents)
// 2. Then clean up comments followed by likes (dependencies on videos and posts and comments)
// 3. Finally clean up watch history

// Actually, await is required in this case. While VS Code might not show it as an error, without await:
// 1. All cleanup operations would run in parallel rather than in sequence
// 2. The responses would be Promises rather than resolved values
// 3. When trying to access data in likesResponse.data, it would be undefined

const cleanupAllOrphanedContent = asyncHandler(async (req, res) => {
    const videos = await cleanupVideos();
    const posts = await cleanupPosts();
    const comments = await cleanupComments();
    const likes = await cleanupLikes();
    const subscriptions = await cleanupSubscriptions();
    const watchHistory = await cleanupWatchHistory();

    res.status(200).json(new ApiResponse(200, { videos, watchHistory, posts, likes, comments, subscriptions }, "All orphaned data cleanup completed successfully"));
});



const cleanupUser = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!userId) throw new ApiError(400, "UserId is required!")

    const user = await User.findById(userId).select(" username avatar coverImage ")
    if (!user) throw new ApiError(400, "User missing!")
    console.log(user)

    const cleanAvatar = await deleteFromCloudinary(user.avatar)

    const cleanup = await User.findByIdAndDelete(userId)
    if (!cleanup) throw new ApiError(400, "Couldn't delete")

    return res.status(200).json(new ApiResponse(200, cleanup, "User deleted"))

})

export {
    cleanupOrphanedVideos,
    cleanupOrphanedWatchHistory,
    cleanupOrphanedPosts,
    cleanupOrphanedLikes,
    cleanupOrphanedComments,
    cleanupOrphanedSubscriptions,
    cleanupAllOrphanedContent,
    cleanupUser
};