import { Router } from "express"
import { 
    addComment,
    getVideoComments,
    updateComment,
    removeComment
} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/video/:videoId").get(getVideoComments).post(addComment)

router.route("/c/:commentId").post(updateComment).delete(removeComment)

export default router