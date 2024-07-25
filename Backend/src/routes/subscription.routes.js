import {Router} from "express"
import {
    toggleSubscription,
    getChannelSubscribers,
    getUserSubscribedChannels
} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/channel/:channelId").post(toggleSubscription).get(getChannelSubscribers)

router.route("/").get(getUserSubscribedChannels)

export default router
