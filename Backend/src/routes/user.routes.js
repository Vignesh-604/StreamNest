import {Router} from "express"
import { changePassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage, updateDetails } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()         // Sets up an express router

// It defines a POST route at /register which calls the registerUser controller function.
// Test by sending an API req to http://localhost:8000/users/register using Postman or thunder client
router.route("/register").post(
    upload.fields([                         // Multiple files upload with specific names and count                   
        {name: "avatar", maxCount: 1},
        {name: "coverImage", maxCount: 1}
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh_token").post(refreshAccessToken)

router.route("/change_password").patch(verifyJWT, changePassword)

router.route("/current_user").get(verifyJWT, getCurrentUser)

router.route("/update_details").patch(verifyJWT, updateDetails)

router.route("/update_avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)

router.route("/update_cover_image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)

router.route("/watch-history").get(verifyJWT, getWatchHistory)

export default router