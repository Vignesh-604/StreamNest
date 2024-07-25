import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {             //async functions returns a promise
    try {
        const con = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log("MONGODB connected!! DB HOST: ", con.connection.host);  // Connection host details

    } catch (error) {
        console.log("MONGODB connection error:", error);
        process.exit(1)                                         // terminate the process
    }
}

export default connectDB