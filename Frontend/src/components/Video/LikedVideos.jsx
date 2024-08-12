import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoItem from "./VideoItem";
import { parseTime } from "../utility";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Loading from '../AppComponents/Loading';

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

    const dislike = (id) => {
        axios.post(`/api/like/v/${id}`)
            .then((res) => {
                setVideos(videos.filter(vid => vid.videos[0]._id !== id));
            })
            .catch(error => console.log(error));
    }

    if (loading) return <Loading />

    return (
        <div className="flex flex-col items-center px-4 min-w-[36rem]">
            <h1 className="font-bold text-start text-5xl mt-7 mb-10">Liked Videos</h1>
            <hr className="w-full"/>
            {
                videos.length ?
                    (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {
                                videos.map((vid) => (
                                    <div className="flex justify-between key={vid._id}" key={vid._id}>
                                        <VideoItem
                                            id={vid.videos[0]?._id}
                                            title={vid.videos[0]?.title}
                                            description={vid.videos[0]?.description}
                                            owner={vid.videos[0]?.owner[0]}
                                            views={vid.videos[0]?.views}
                                            thumbnail={vid.videos[0]?.thumbnail}
                                            duration={parseTime(vid.videos[0]?.duration)}
                                        />
                                        <div className="flex items-start mt-6">
                                            <button
                                                onClick={() => dislike(vid.videos[0]._id)}
                                                className="flex justify-center md:items-center"
                                                title="Remove video"
                                            >
                                                <XMarkIcon className="m-2 h-7 w-7 text-white hover:bg-gray-500 hover:bg-opacity-15 rounded-xl" />
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
    );
}
