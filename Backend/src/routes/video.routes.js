import {Router} from "express"
import {
    publishVideo,
    updateVideo,
    deleteVideo,
    getEditDetails,
    getVideoById,
    getAllVideos,
} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/new").post(
    upload.fields([
        {name: "videoFile", maxCount: 1},
        {name: "thumbnail", maxCount: 1}
    ]),
    publishVideo
)

router.route("/v/:videoId").patch(upload.single("thumbnail"), updateVideo)
.get(getVideoById).delete(deleteVideo)

router.route("/details/:videoId").get(getEditDetails)

router.route("/").get(getAllVideos)

export default router