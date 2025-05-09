import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next) => {

    try {
        // extract the token from either the accessToken cookie or the Authorization header (removing the Bearer prefix).
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized")
        }

        // Verify the decoded token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // Find the user without password and token
        const user = await User.findById(decodedToken._id).select(" _id fullname username uploads avatar ")

        if (!user) throw new ApiError(401, "Invalid Access Token")

        // The user object is attached to req object and sent to logout function
        req.user = user
        next()                      // middleware work done, move to required action

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})