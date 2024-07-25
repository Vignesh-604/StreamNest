import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    toggleCommentLike,
    toggleVideoLike,
    togglePostLike,
    getLikedVideos
} from "../controllers/like.controller.js"

const router = Router()

router.use(verifyJWT)

router.route("/c/:commentId").post(toggleCommentLike)

router.route("/t/:postId").post(togglePostLike)

router.route("/v/:videoId").post(toggleVideoLike)

router.route("/likedVideos").get(getLikedVideos)

export default router
