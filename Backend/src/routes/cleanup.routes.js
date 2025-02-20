import { Router } from "express"
import {
    cleanupOrphanedVideos,
    cleanupOrphanedWatchHistory,
    cleanupOrphanedPosts,
    cleanupOrphanedLikes,
    cleanupOrphanedComments,
    cleanupOrphanedSubscriptions,
    cleanupAllOrphanedContent,
    cleanupUser
} from "../controllers/cleanup.controller.js"

const router = Router()

router.get("/videos", cleanupOrphanedVideos)
router.get("/posts", cleanupOrphanedPosts)
router.get("/comments", cleanupOrphanedComments)
router.get("/likes", cleanupOrphanedLikes)
router.get("/history", cleanupOrphanedWatchHistory)
router.get("/subs", cleanupOrphanedSubscriptions)
router.get("/all", cleanupAllOrphanedContent)
router.get("/user/:userId", cleanupUser)

export default router