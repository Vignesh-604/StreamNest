import { Router } from "express"
import { createPost, updatePost, deletePost, getUserPosts } from "../controllers/post.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)       // Apply JWT middleware to all routes to this file

router.route("/new").post(createPost)

router.route("/:postId").post(updatePost).delete(deletePost)

router.route("/user/:userId").post(getUserPosts)

export default router