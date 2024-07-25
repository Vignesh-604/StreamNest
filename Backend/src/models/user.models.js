import {Schema, model} from "mongoose";
import bycrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        index: true                     // For searching
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,               //cloudinary url: using third party
        required: true
    },
    coverImage: {
        type: String
    },
    watchHistory: [
        {
        type: Schema.Types.ObjectId,
        ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    }
},
{timestamps: true}
)

// Normal function to get the current schema context and async because encypting may take some time
// This middleware runs before saving a user document (.pre("save")). It hashes the password if it has been modified.
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    // Hashes password with a salt rounds value of 10, which means the hashing process will apply 10 rounds of salting to the password.
    this.password = await bycrypt.hash(this.password, 10)     // encrypt password
    next()
})

// This method compares a given password with the hashed password stored in the database.
userSchema.methods.isPasswordCorrect = async function(password){
    return await bycrypt.compare(password, this.password)
}

// This method generates a JWT access token with user details.
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(                                               //jwt.sign(payload or data, secretKey, options (Expiry))
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// This method generates a JWT refresh token with minimal user data.
// used to obtain a new access token when the current one expires.
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = model("User", userSchema)

/*
Additional Details on Bycrypt
Salt: A random value added to the password before hashing to ensure that even if two users have the same password, their hashed values will be different.
Hashing: bcrypt performs multiple rounds of hashing to make it computationally expensive to crack passwords using brute force attacks.
Security: bcrypt is designed to be slow to protect against brute-force attacks. The number of salt rounds can be adjusted to balance security and performance.
 */