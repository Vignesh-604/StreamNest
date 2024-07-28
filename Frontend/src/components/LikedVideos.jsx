import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoItem from "./VideoItem";
import {parseTime} from "./time"

export default function LikedVideos() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get("/api/like/likedVideos")
            .then((res) => setVideos(res.data.data))
            .catch(error => console.log(error));
    }, []);

    const toggleLike = (id) => {
        axios.post(`/api/like/v/${id}`)
        .then((res) => {
            setVideos(videos.filter(vid => vid.videos[0]._id !== id))
        }
        )
        .catch(error => console.log(error));

    }

    return (
        <div className="flex flex-col items-center px-4 min-w-[36rem]">
            <h1 className="font-bold text-start text-5xl mt-7 mb-10 ">Liked Videos</h1>
            <div className="space-y-6">
                {
                    videos.length ?
                    (
                    videos.map((vid) => (
                        <VideoItem key={vid._id}
                            id={vid.videos[0]._id}
                            title={vid.videos[0].title} 
                            description={vid.videos[0].description} 
                            owner={vid.videos[0].owner[0].username} 
                            views={vid.videos[0].views} 
                            thumbnail={vid.videos[0].thumbnail}
                            duration={parseTime(vid.videos[0].duration)}
                            toggleLike={toggleLike}
                        />
                    ))
                ) : (
                    <h1 className="flex place-content-center font-bold text-5xl my-7">No Liked Videos</h1>
                )
                }
            </div>
        </div>
    );
}
