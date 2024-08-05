import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.models.js"
import mongoose from "mongoose";

const toggleSubscription = asyncHandler( async (req, res) => {
    const user = req.user?._id
    if (!user) throw new ApiError(404, "Not the user")

    const {channelId }= req.params
    if (!channelId) throw new ApiError(404, "Not the channel")

    let subscription = await Subscription.findOneAndDelete({subscriber: user, channel: channelId})
    
    if (subscription === null) {

        subscription = await Subscription.create({subscriber: user, channel: channelId})
        res.status(200).json(new ApiResponse(200, subscription, "Channel subscribed"))

    } else {
        res.status(200).json(new ApiResponse(200, null, "Channel unsubscribed"))
    }
})

// Return subscriber list of channel
const getChannelSubscribers = asyncHandler( async (req, res) => {
    const {channelId }= req.params
    if (!channelId) throw new ApiError(404, "Not the channel")

    // const subscribers = await Subscription.find({channel: channelId}).select("subscriber")
    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber"
            }
        },
        {
            $addFields: {
                subscriber: { $first: "$subscriber"}
            }
        },
        {
            $project: {
                "subscriber._id": 1,
                "subscriber.fullname": 1,
                "subscriber.username": 1,
                "subscriber.avatar": 1
            }
        }
    ])

    res.status(200).json( new ApiResponse(200, subscribers, "Subscribers fetched"))
})

// User subscribed channels
const getUserSubscribedChannels = asyncHandler( async (req, res) => {
    const user = req.user?._id
    if (!user) throw new ApiError(404, "Not the user")

    // const subscriptions = await Subscription.find({subscriber: user})
    const subscriptions = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(user)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedTo",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },

                    {
                        $addFields: {
                            subscribers: { $size: "$subscribers"}
                        }
                    },
                ]
            }
        },
        {
            $unwind: "$subscribedTo"
        },
        {
            $project: {
                subscribedTo: {
                    _id: 1,
                    fullname: 1,
                    username:1,
                    avatar: 1,
                    subscribers:1
                }
            }
        }
    ])

    res.status(200).json( new ApiResponse(200, subscriptions, "Subs fetched"))
})



export {
    toggleSubscription,
    getChannelSubscribers,
    getUserSubscribedChannels
}