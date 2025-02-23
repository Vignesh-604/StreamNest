import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload File on Cloudinary inside a specified folder
const uploadOnCloudinary = async (localFilepath, type) => {
    try {
        if (!localFilepath) return null;

        // Define folder structure
        const folderMap = {
            avatar: "streamnest/avatar",
            thumbnail: "streamnest/thumbnails",
            video: "streamnest/videos"
        };

        const folder = folderMap[type] || "streamnest/user";

        // Upload File to Cloudinary
        const response = await cloudinary.uploader.upload(localFilepath, {
            folder,
            resource_type: type === "video" ? "video" : "auto"
        });

        console.log(`File uploaded to ${folder}!! URL: `, response.url);
        fs.unlinkSync(localFilepath); // Delete the locally saved temp file

        return response;
    } catch (error) {
        console.error("Upload failed:", error);
        fs.unlinkSync(localFilepath); // Delete the locally saved temp file
        return null;
    }
}

// Delete File from Cloudinary
const deleteFromCloudinary = async (url) => {
    const parts = url.split("/")
    const fileNameWithExt = parts[parts.length - 1]
    const folderName = parts[parts.length - 2]

    const [public_id, ext] = fileNameWithExt.split(".")

    const response = await cloudinary.uploader.destroy(
        `streamnest/${folderName}/${public_id}`,
        { resource_type: ext === "mp4" ? "video" : "image" }
    );

    // if (response.result === "ok") console.log("✅ File deleted:", public_id)
    // if (response.result === "not found") console.log("⚠️ File not found")
    return response
};

export { uploadOnCloudinary, deleteFromCloudinary }
