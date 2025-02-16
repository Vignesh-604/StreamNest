import {Router} from "express"
import { 
    changePassword, 
    getCurrentUser, 
    getUserChannelProfile,
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAvatar, 
    updateDetails 
} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([                
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

router.route("/channel/:userId").get(verifyJWT, getUserChannelProfile)

export default router