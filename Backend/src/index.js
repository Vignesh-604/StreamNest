import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"

dotenv.config({ path: "./.env" })    // loading environment variables from a .env file.

connectDB()                         // promise is returned
.then(() => {
    app.on("error", (error) => console.log("ERROR: ", error))

    app.listen(process.env.PORT || 8000, () => {
        console.log("Listening on port no.", process.env.PORT);
    })
})
.catch((e) => console.log("Connection error: ", e))
