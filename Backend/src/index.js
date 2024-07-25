import dotenv from "dotenv"
import mongoose from 'mongoose'
import express from "express"
import { DB_NAME } from "./constants.js"
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



// // DB connection in single file
// import express from 'express'
// const app = express()

// ;(async () => {
//   try {
//     const con = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     console.log("Connected to :", con.connection.host);

//     app.on("error", (error) => {
//         console.log("ERROR:", error);
//     })
//     app.listen(process.env.PORT, () => {
//         console.log("Listening on port no.", process.env.PORT);
//     })

//   } catch (error) {
//     console.log(error)
//   }
// })()
