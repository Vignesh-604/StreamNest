import {Router} from "express"
import {
    trackWatchHistory,
    deleteVideoFromHistory,
    getUserWatchHistory,
    clearUserWatchHistory,
} from "../controllers/watchHistory.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/track/:video").post(trackWatchHistory)

router.route("/remove/:historyId").delete(deleteVideoFromHistory)

router.route("/:userId").get(getUserWatchHistory).delete(clearUserWatchHistory)

export default router