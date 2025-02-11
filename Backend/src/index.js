import dotenv from "dotenv"
import connectDB from "./db/index.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config({ path: "./.env" })    // loading environment variables from a .env file.

const app = express()

app.use(cors({                              // express uses .use for using middlewares
    origin: process.env.CORS_ORIGIN,        // allow requests from the specified origin
    credentials: true                       // cookies to be included in cross-origin requests.
}))

// To handle data
app.use(express.json({limit: "16kb"}))                          // To accept json data of certain limit
app.use(express.urlencoded({extended: true, limit: "16kb"}))    // Accept data from url
app.use(express.static("public"))                               // To store static files like images,etc param:folder_name
app.use(cookieParser())                                         // To set and edit cookies


// Database connection
connectDB()                                                     // promise is returned
.then(() => {
    app.on("error", (error) => console.log("ERROR: ", error))

    app.listen(process.env.PORT || 8000, () => {
        console.log("Listening on port no.", process.env.PORT);
    })
})
.catch((e) => console.log("Connection error: ", e))


// Routes
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import videoRouter from "./routes/video.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import watchHistoryRouter from "./routes/watchHistory.routes.js"

app.use("/api/users", userRouter)
app.use("/api/post", postRouter)
app.use("/api/comment", commentRouter)
app.use("/api/like", likeRouter)
app.use("/api/playlist", playlistRouter)
app.use("/api/dashboard", dashboardRouter)
app.use("/api/video", videoRouter)
app.use("/api/subscription", subscriptionRouter)
app.use("/api/watchHistory", watchHistoryRouter)

export {app}