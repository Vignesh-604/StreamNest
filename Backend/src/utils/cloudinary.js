import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilepath) => {
    try {
        if (!localFilepath) return null

        // Upload File on cloudinary
        const response = await cloudinary.uploader.upload(localFilepath, {resource_type:"auto"})

        console.log("File uploaded!! URL: ", response.url);
        fs.unlinkSync(localFilepath)                //delete the locally saved temp file

        return response

    } catch (error) {
        fs.unlinkSync(localFilepath)                //delete the locally saved temp file
        return null
    }
}

const deleteFromCloudinary = async(url) => {
    const parts = url.split("/")
    const name = parts[parts.length-1]
    const file = name.split(".")

    const public_id = file[0]
    const ext = file[1]

    const response = await cloudinary.uploader.destroy(
        public_id, 
        {resource_type: ext === "mp4" ? "video" : "image"}
    )

    if (response.result === "ok") console.log("File deleted: ", name);
    if (response.result === "not found") console.log("File not found");
    return response
}

export {uploadOnCloudinary, deleteFromCloudinary}