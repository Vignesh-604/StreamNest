import React, { useState, useEffect } from 'react';
import img from "./assets/thumbnail.jpeg"
import axios from 'axios';
import { timeAgo } from './utility';
import { useNavigate } from 'react-router-dom';


const videos = [
    {
        id: 1,
        thumbnail: 'thumbnail1.jpg',
        title: 'Video Title 1',
        channel: 'Channel Name',
        views: '1M views · 1 day ago'
    },
    {
        id: 2,
        thumbnail: 'thumbnail2.jpg',
        title: 'Video Title 2',
        channel: 'Channel Name',
        views: '500K views · 3 days ago'
    },
    {
        id: 2,
        thumbnail: 'thumbnail2.jpg',
        title: 'Video Title 2',
        channel: 'Channel Name',
        views: '500K views · 3 days ago'
    },
    {
        id: 2,
        thumbnail: 'thumbnail2.jpg',
        title: 'Video Title 2',
        channel: 'Channel Name',
        views: '500K views · 3 days ago'
    },
    {
        id: 2,
        thumbnail: 'thumbnail2.jpg',
        title: 'Video Title 2',
        channel: 'Channel Name',
        views: '500K views · 3 days ago'
    },
    // Add more video objects as needed
];

export default function Home() {

    const [videos, setVideos] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        axios.get("/api/video?limit=20")
            .then(res => setVideos(res.data.data))
            .catch(e => console.log(e))
    }, [])
    console.log(videos);



    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center mb-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-screen-xl">
                {videos.map(video => (
                    <div key={video._id} className="bg-gray-800 h-[330px] w-[300px] rounded-lg overflow-hidden transform hover:scale-105 transition-transform cursor-pointer">

                        <img
                            src={video.thumbnail ? video.thumbnail : img}
                            alt={`Thumbnail for ${video.title}`}
                            onError={(e) => e.target.src = img}
                            className="w-full h-[200px] object-cover border rounded-lg border-gray-700"
                        />

                        <div className="flex flex-row space-x-2 p-3">
                            <div>
                                <img
                                    title = {video.owner[0].fullname}
                                    src = {video.owner[0].avatar}
                                    className = "rounded-full object-cover w-12 h-12 min-w-[12px] mt-1 cursor-pointer"
                                    onClick = {() => navigate(`/channel/${video.owner[0]._id}`)}
                                />
                            </div>

                            <div className='flex-col w-[220px]'>
                                <h3 className="text-white text-lg font-semibold line-clamp-2 " title={video.title}>
                                    {video.title}
                                </h3>

                                <p
                                    title = {video.owner[0].fullname}
                                    className="text-gray-400 cursor-pointer"
                                    onClick={() => navigate(`/channel/${video.owner[0]._id}`)}
                                >
                                    {video.owner[0].fullname} · @{video.owner[0].username}
                                </p>

                                <p className="text-gray-400">{video.views} views · {timeAgo(video.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
