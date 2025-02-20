import {Router} from "express"
import { buyVideo, buyPlaylist, getPurchaseHistory, buyUploadSlots } from "../controllers/purchase.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/buy/vide/:videoId").get(buyVideo)

router.route("/buy/playlist/:playlistId").get(buyPlaylist)

router.route("/buy/playlist/:uploadCount").get(buyUploadSlots)

router.route("/track/:userId").get(getPurchaseHistory)

export default router