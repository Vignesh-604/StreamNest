import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Steps to register new user:
// Get user data from frontend
// Validation - not empty
// Check if user exists
// Check for images - avatar and cover image
// upload to cloudinary - crosscheck
// create user object in db - create db entry
// remove password and refresh token field
// check for user creation
// return response

const registerUser = asyncHandler(async (req, res) => {

    // Get user details
    const { username, fullname, email, password } = req.body
    // console.log("EMail", email);

    // Validation - checking if each field is not empty or just spaces
    if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
        return res.status(400).json( new ApiResponse(400, "All input fields must be filled"))
    }

    // Check for user - find username or password
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) return res.status(409).json( new ApiResponse(409, "User with email or username already exists"))

    // Checking for images in local folder uploaded by multer
    // console.log(req.files);
    const avatarPath = req.files?.avatar[0]?.path               // need checking for avatar img
    // const coverImagePath = req.files?.coverImage[0]?.path

    let coverImagePath
    if (req.files?.coverImage && Array.isArray(req.files?.coverImage) && req.files.coverImage.length > 0) coverImagePath = req.files?.coverImage[0]?.path

    if (!avatarPath) {
        return res.status(404).json( new ApiResponse(404, "Avatar Image is required"))
    }

    // Uploading on Cloudinary and checking for img url
    const avatar = await uploadOnCloudinary(avatarPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    if (!avatar) {
        throw new ApiError(404, "Avatar not found!")
    }

    // Creating user in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    })

    // Refresh and access tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // Removing password and refresh tokens
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) return res.status(500).json( new ApiResponse(500, "Something went wrong while registering the user"))

    return res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, createdUser, "User Registered successfully!!"))
})

// Steps to login user:
// Get details
// Username or email login
// Find user in DB
// get password
// access and refresh token
// send cookies

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

// Cookies cannot be accessed by client-side scriptsand are sent by HTTPS only 
const options = { httpOnly: true, secure: true }

// Login and Logout using Postman vscode extension DOESN'T SEND COOKIES! Use Postman application!!
const loginUser = asyncHandler(async (req, res) => {

    // Fetch details and check for req fields
    const { username, email, password } = req.body
    if (!username && !email) throw new ApiError(400, "Username or Email is required!!")

    // Check in db for username or email
    // MongoDB predefined methods can be accessed directly from schema
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) return res.status(404).json( new ApiResponse(404, "Incorrect username or email"))

    // Password checking
    // Custom made methods can only be accessed from db fetched user details
    const validPassword = await user.isPasswordCorrect(password)
    if (!validPassword) return res.status(404).json( new ApiResponse(404,"Password incorrect"))

    // Refresh and access tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // Optional step: fetching details without passsword and tokens
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

        // Compares the incomingRefreshToken with the refresh token stored in the user's record
        if (incomingRefreshToken !== user.refreshToken) throw new ApiError(400, "Refresh token is expired or used")

        // Generate new tokens
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

    // Updates the values and returns the user w/o password
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

    const avatar = await uploadOnCloudinary(avatarPath)     // returns avatar object - need to fetch only url
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

const updateCoverImage = asyncHandler(async (req, res) => {

    const coverImagePath = req.file?.path
    if (!coverImagePath) throw new ApiError(404, "Cover Image file is missing")

    const coverImage = await uploadOnCloudinary(coverImagePath)     // returns coverImage object - need to fetch only url
    if (!coverImage) throw new ApiError(404, "Cover Image file is missing in cloudinary")

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { coverImage: coverImage.url } },
        { new: true }
    ).select("-password")

    const deleteOnCloud = await deleteFromCloudinary(req.user?.coverImage)
    console.log("Deleted old cover image");

    res.status(200).json(new ApiResponse(200, user, "Cover Image changed successfully!!"))

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
            $lookup: {                      // to get number of subscibers
                from: "subscriptions",      // model is stored in lower case and in plural form
                localField: "_id",          // param user_id
                foreignField: "channel",    // in channel field
                as: "subscribers"           // create new set of documents with param user_id in channel field
            },
        },
        // {
        //     $lookup: {                     // to get channles you've subscibed to
        //         from: "subscriptions",
        //         localField: "_id",
        //         foreignField: "subscriber",
        //         as: "subscribedTo"
        //     },
        // },
        {
            $addFields: {
                // subscribersCount: {
                //     $size: "$subscribers"
                // },
                // channelSubscribedTo: {
                //     $size: "$subscribedTo"
                // },
                isSubscribed: {
                    // subscribers document has param_user_id as the channel and multiple user_ids of subscribers
                    // searching current userid in param_userid's subscriber list
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
                // subscribersCount: 1,
                // channelSubscribedTo: 1,
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
    updateCoverImage,
    getUserChannelProfile,
}