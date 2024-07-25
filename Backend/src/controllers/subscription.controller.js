import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.models.js"

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

    const subscribers = await Subscription.find({channel: channelId}).select("subscriber")

    res.status(200).json( new ApiResponse(200, subscribers, "Subscribers fetched"))
})

// User subscribed channels
const getUserSubscribedChannels = asyncHandler( async (req, res) => {
    const user = req.user?._id
    if (!user) throw new ApiError(404, "Not the user")

    const subscriptions = await Subscription.find({subscriber: user})

    res.status(200).json( new ApiResponse(200, subscriptions, "Subs fetched"))
})



export {
    toggleSubscription,
    getChannelSubscribers,
    getUserSubscribedChannels
}