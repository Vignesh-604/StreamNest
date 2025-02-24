
import {Router} from "express"
import {
    getChannelStats,
    getChannelVideos,
    getRandomChannelVideos
} from "../controllers/dashboard.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/stats/:channelId").get(getChannelStats)

router.route("/videos/:channelId").get(getChannelVideos)

router.route("/more/:channelId").get(getRandomChannelVideos)

export default router
