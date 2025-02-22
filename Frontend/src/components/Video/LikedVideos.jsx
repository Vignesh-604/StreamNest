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
            .catch(error => console.log(error));
    }, []);
    console.log(videos)

    const removeLiked = (id) => {
        showConfirmAlert(
            "Remove Liked Video?",
            "Are you sure you want to remove this video from your liked videos? This action cannot be undone.",
            () => {
                axios.delete(`/api/likes/remove/${id}`)
                    .then(() => {
                        showCustomAlert("Removed!", "Video has been removed from your liked videos.");
                        setVideos(videos.filter(vid => vid._id !== id));
                    })
                    .catch(error => console.log(error));
            }
        );
    };

    if (loading) return <Loading />

    return (
        <div className="flex flex-col items-center bg-[#0a0a26]/40 text-white px-6 py-8 min-h-screen">
            <div className="bg-[#24273a] rounded-lg p-8 mb-8 w-full ">
                <h1 className="font-extrabold text-start text-4xl mb-10">Liked Videos</h1>
                {
                    videos.length ?
                        (
                            <div className="grid gap-6 lg:grid-cols-2">
                                {
                                    videos.map((vid) => (
                                        <div key={vid._id} className="flex justify-between card">
                                            <VideoItem
                                                id={vid.videos[0]?._id}
                                                title={vid.videos[0]?.title}
                                                description={vid.videos[0]?.description}
                                                owner={vid.videos[0]?.owner[0]}
                                                views={vid.videos[0]?.views}
                                                isExclusive={vid.videos[0]?.isExclusive}
                                                thumbnail={vid.videos[0]?.thumbnail}
                                                duration={parseTime(vid.videos[0]?.duration)}
                                            />
                                            <div className="flex items-start mt-6">
                                                <button
                                                    onClick={() => removeLiked(vid._id)}
                                                    className="flex justify-center md:items-center transform hover:scale-120"
                                                    title="Remove video"
                                                >
                                                    <X className="m-2 h-7 w-7 text-white hover:bg-gray-500/20 hover:bg-opacity-15 rounded-xl" />
                                                </button>
                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                        ) : (
                            <h1 className="flex justify-center font-bold text-start text-4xl mt-7 mb-10">No Liked Videos</h1>
                        )
                }
            </div>
        </div>
    );
}
