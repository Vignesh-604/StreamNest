import { Router } from "express"
import { createPost, updatePost, deletePost, getUserPosts, getPostById } from "../controllers/post.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)       // Apply JWT middleware to all routes to this file

router.route("/new").post(createPost)

router.route("/:postId").post(updatePost).delete(deletePost).get(getPostById)

router.route("/user/:userId").get(getUserPosts)

export default router