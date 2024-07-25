import { Router } from "express";
import {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addVideo,
    removeVideo,
    getUserPlaylists,
    getPlaylistById
} from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/").post(createPlaylist)

router.route("/:playlistId").get(getPlaylistById).post(updatePlaylist).delete(deletePlaylist)

router.route("/video/:videoId/:playlistId").post(addVideo).delete(removeVideo)

router.route("/user/:userId").get(getUserPlaylists)

export default router