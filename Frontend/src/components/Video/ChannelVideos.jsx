import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"
import VideoItem from "./VideoItem";
import { parseTime } from "../utility";

export default function ChannelVideos({ channelId = ""}) {
    const id = channelId === "" ? (JSON.parse(Cookies.get("user")))._id : channelId

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get(`/api/dashboard/videos/${id}`)
            .then((res) => setVideos(res.data.data))
            .catch(error => console.log(error));
    }, []);

    const toggleLike = (id) => {
        // axios.post(`/api/like/v/${id}`)
        //     .then((res) => {
        //         setVideos(videos.filter(vid => vid._id !== id));
        //     })
        //     .catch(error => console.log(error));
    }

    return (
        <div className="flex flex-col px-4 min-w-[36rem]">
            <h1 className="font-bold text-start text-5xl mt-7 mb-10">Videos</h1>
            <div className="grid gap-2 lg:grid-cols-2">
                {
                    videos.length ?
                    (
                        videos.map((vid) => (
                            <VideoItem key={vid._id}
                                id={vid._id}
                                title={vid.title}
                                description={vid.description}
                                owner={vid.owner[0].username}
                                views={vid.views}
                                thumbnail={vid.thumbnail}
                                duration={parseTime(vid.duration)}
                                toggleLike={toggleLike}
                            />
                        ))
                    ) : (
                        <h1 className="flex place-content-center font-bold text-5xl my-7">Channel has no Videos</h1>
                    )
                }
            </div>
        </div>
    );
}
