import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {

    const { username, fullname, email, password } = req.body

    if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
        return res.status(400).json( new ApiResponse(400, "All input fields must be filled"))
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) return res.status(409).json( new ApiResponse(409, "User with email or username already exists"))

    const avatarPath = req.files?.avatar[0]?.path               // need checking for avatar img

    if (!avatarPath) {
        return res.status(404).json( new ApiResponse(404, "Avatar Image is required"))
    }

    const avatar = await uploadOnCloudinary(avatarPath)

    if (!avatar) {
        throw new ApiError(404, "Avatar not found!")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        email,
        username: username.toLowerCase(),
        password
    })

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) return res.status(500).json( new ApiResponse(500, "Something went wrong while registering the user"))

    return res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, createdUser, "User Registered successfully!!"))
})

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken                // save the refreshToken in user's db
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generation tokens!")
    }
}

const options = { httpOnly: true, secure: true }

const loginUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body
    if (!username && !email) throw new ApiError(400, "Username or Email is required!!")

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) return res.status(404).json( new ApiResponse(404, "Incorrect username or email"))

    const validPassword = await user.isPasswordCorrect(password)
    if (!validPassword) return res.status(404).json( new ApiResponse(404,"Password incorrect"))

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully!!"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },    // Removes the refreshToken field
        { new: true }
    )

    return res.status(200)
        .clearCookie("accessToken")     // clears tokens from cookies
        .clearCookie("refreshToken")
        .clearCookie("user")
        .json(new ApiResponse(200, {}, "User logged out successfully!!"))
})

// The function handles the refresh token request by verifying the provided token, fetching the corresponding user,
// checking the validity of the token, generating new tokens, and returning them in cookies.
const refreshAccessToken = asyncHandler(async (req, res) => {

    // Retrive refreshToken from cookie or body of request
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request")

    try {
        // Token is decoded to get user info
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) throw new ApiError(401, "Invalid refresh Token")

        if (incomingRefreshToken !== user.refreshToken) throw new ApiError(400, "Refresh token is expired or used")

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken, refreshToken
                    },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(403, "Something went wrong during refresh token generation")
    }
})

const changePassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) throw new ApiError(403, "Old password incorrect")

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Password updated!"))
})

const getCurrentUser = asyncHandler(async (req, res) => {

    const userDetails = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "likedBy",
                as: "likedVids"
            }
        },
        {
            $lookup: {
                from: "playlists",
                localField: "_id",
                foreignField: "owner",
                as: "playlists"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscriptions"
            }
        },
        {
            $addFields: {
                likedVidCount: {
                    $size: {
                        $filter: {
                            input: "$likedVids",
                            as: "likedVid",
                            cond: {$ne: ["$likedVid.video", null]}
                        }
                    }
                },
                playlists :{
                    $size: "$playlists"
                },
                subscriptions: {
                   $size: "$subscriptions" 
                }
            }
        },
        {
            $project: {
                username:1,
                fullname: 1,
                avatar: 1,
                createdAt:1,
                email: 1,

                likedVidCount: 1,
                playlists: 1,
                subscriptions: 1
            }
        }
    ])
    if (!userDetails.length) throw new ApiError(404, "Found nothing")

    return res.status(200).json(new ApiResponse(200, userDetails[0], "User fetched successfully"))
})

const updateDetails = asyncHandler(async (req, res) => {

    const { fullname, email } = req.body

    if (!fullname || !email) throw new ApiError(400, "Both fields are required!")

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { fullname, email }
        },
        { new: true }

    ).select("-password")

    res.status(201).json(new ApiResponse(200, user, "Account details updated"))
})

const updateAvatar = asyncHandler(async (req, res) => {

    const avatarPath = req.file?.path
    if (!avatarPath) throw new ApiError(404, "Avatar file is missing")

    const avatar = await uploadOnCloudinary(avatarPath, "avatar")     // returns avatar object - need to fetch only url
    if (!avatar) throw new ApiError(404, "Avatar file is missing in cloudinary")

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { avatar: avatar.url } },
        { new: true }
    ).select("-password")

    const deleteOnCloud = await deleteFromCloudinary(req.user?.avatar)
    console.log("Deleted old avatar");

    res.status(200).json(new ApiResponse(200, user, "Avatar changed successfully!!"))

})

const getUserChannelProfile = asyncHandler(async (req, res) => {

    const { userId } = req.params
    if (!userId) throw new ApiError(400, "UserId is required!")

    const channel = await User.aggregate([
        {
            $match: {                               // match current user userId
                _id: new mongoose.Types.ObjectId(userId)
            },
        },
        {
            $lookup: {                      
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            },
        },
        {
            $addFields: {
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {                 // payload to send from new aggregated data model
                fullname: 1,
                username: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                createdAt: 1,
                isSubscribed: 1
            }
        }
    ])

    if (!channel?.length) throw new ApiError(404, "Channel does not exist")
    
    res.status(200).json(new ApiResponse(200, channel[0], "Channel found"))
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateDetails,
    updateAvatar,
    getUserChannelProfile,
}