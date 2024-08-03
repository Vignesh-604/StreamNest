import { Router } from "express"
import { 
    addVideoComment,
    addPostComment,
    getVideoComments,
    getPostComments,
    updateComment,
    removeComment
} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/video/:videoId").get(getVideoComments).post(addVideoComment)
router.route("/post/:postId").get(getPostComments).post(addPostComment)
// router.route("/comment/:commentId").get(getCommentReplies).post(addComment)

router.route("/c/:commentId").post(updateComment).delete(removeComment)

export default router