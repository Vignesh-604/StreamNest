import {Router} from "express"
import { videoInfo, buyVideo, buyPlaylist, getPurchaseHistory, buyUploadSlots } from "../controllers/purchase.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/info/:videoId").get(videoInfo);

router.route("/buy/video/:videoId").get(buyVideo)

router.route("/buy/playlist/:playlistId").get(buyPlaylist)

router.route("/buy/playlist/:uploadCount").get(buyUploadSlots)

router.route("/track").get(getPurchaseHistory)

export default router