import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoItem from "./VideoItem";
import { X } from "lucide-react";
import Loading from '../AppComponents/Loading';
import { showCustomAlert, showConfirmAlert, parseTime } from "../Utils/utility";

export default function LikedVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get("/api/like/likedVideos")
            .then((res) => {
                setVideos(res.data.data)
                setLoading(false)
            })
            .catch(error => {
                console.error("Error fetching liked videos:", error)
                setLoading(false)
            })
    }, [])

    const removeLiked = (videoId) => {
        showConfirmAlert(
            "Remove Liked Video?",
            "",
            () => {
                axios.post(`/api/like/v/${videoId}`)
                    .then((res) => {
                        showCustomAlert("Removed!", "Video has been removed from your liked videos.");
                        setVideos(prevVideos => prevVideos.filter(vid => 
                            vid.videos[0]?._id !== videoId
                        ))
                    })
                    .catch(error => {
                        console.error("Error removing video:", error);
                        showCustomAlert("Error", "Failed to remove video. Please try again.");
                    });
            }
        );
    };

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col items-center bg-[#0a0a26]/40 text-white px-6 py-8 min-h-screen">
            <div className="bg-[#24273a] rounded-lg p-8 mb-8 w-full">
                <h1 className="font-extrabold text-start text-4xl mb-10">Liked Videos</h1>
                {videos && videos.length > 0 ? (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {videos.map((vid) => {
                            const videoData = vid.videos?.[0];
                            if (!videoData) return null;

                            return (
                                <div key={videoData._id} className="flex justify-between card">
                                    <VideoItem
                                        id={videoData._id}
                                        title={videoData.title}
                                        description={videoData.description}
                                        owner={videoData.owner?.[0]}
                                        views={videoData.views}
                                        isExclusive={videoData.isExclusive}
                                        thumbnail={videoData.thumbnail}
                                        duration={parseTime(videoData.duration)}
                                    />
                                    <div className="flex items-start mt-6">
                                        <button
                                            onClick={() => removeLiked(videoData._id)}
                                            className="flex justify-center md:items-center transform hover:scale-105 transition-transform"
                                            title="Remove video"
                                        >
                                            <X className="m-2 h-7 w-7 text-white hover:bg-gray-500/20 rounded-xl" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <h1 className="flex justify-center font-bold text-start text-4xl mt-7 mb-10">
                        No Liked Videos
                    </h1>
                )}
            </div>
        </div>
    );
}