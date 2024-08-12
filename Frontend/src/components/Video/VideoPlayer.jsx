import React from 'react';
import axios from "axios";
import profile from "../assets/profile.webp";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext} from "react-router-dom";
import Loading from '../AppComponents/Loading';
import { parseDate } from '../utility';
import { CalendarArrowDown, Eye, List, ThumbsUp } from 'lucide-react';
import Comment from '../Post/Comment';

function VideoPage() {
    const currentUser = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    const {videoId} = useParams()
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([])
    console.log(comments);

    useEffect(() => {
        axios.get(`/api/video/v/${videoId}`)
            .then((res) => {
                const videoDetails = res.data.data[0]
                setVideo(videoDetails);
                setLoading(false)
            })
            .catch(error => console.log(error));

        axios.get(`/api/comment/video/${videoId}`)
            .then((res) => setComments(res.data.data.docs))
            .catch(error => console.log(error));
    }, []);

    const toggleSub = () => {
        axios.post(`/api/subscription/channel/${video.owner._id}`)
            .then(res => {
                setVideo({ ...video, isSubscribed: !video.isSubscribed, subscribers: (res.data.data == null ? --video.subscribers : ++video.subscribers) })
            })
            .catch(e => console.log(e.response.data))
    }

    const toggleVideoLike = () => {
        axios.post(`/api/like/v/${videoId}`)
            .then((res) => setVideo(
                video => ({
                    ...video,
                    isLiked: !video.isLiked,
                    likes: video.isLiked ? video.likes - 1 : video.likes + 1
                })
            ))
            .catch(error => console.log(error));
    }

    if (loading) return <Loading />

    return (
        <div>
            <div className="h-[580px] text-white flex max-lg:flex-col mx-14 max-lg:items-center">
                {/* Video Player Section */}
                <div className="w-[70%] h-[586px] max-lg:w-full flex mt-5 justify-center items-center rounded-lg bg-black">
                    <video className="w-[1400px] h-auto max-h-full object-contain rounded-lg" controls>
                        <source src={video.videoFile} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Video Details Section */}
                <div className="lg:w-[30%] p-4 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold mb-4 lg:line-clamp-3">
                            {video.title}
                        </h1>

                        <div className='flex flex-row justify-between max-[500px]:flex-col'>
                            <div
                                className="flex items-center text-sm text-gray-400 mb-4 cursor-pointer"
                                title={video.owner.fullname}
                                onClick={() => navigate(video.owner._id !== currentUser._id ? `/channel/${video.owner._id}` : "/channel")}
                            >
                                <img
                                    src={video.owner.avatar ? video.owner.avatar : profile}
                                    alt="Channel Logo"
                                    className="h-12 w-12 rounded-full mr-4"
                                />
                                <div>
                                    <p className="text-white">{video.owner.fullname}</p>
                                    <p>{video.subscribers} subscribers</p>
                                </div>
                            </div>
                            <div onClick={toggleSub} className='mr-3'>
                                {
                                    video.isSubscribed ? (
                                        <button className="subscribe-button border bg-red-700 rounded-lg text-xl px-3 py-1.5">
                                            Subscribed
                                        </button>
                                    ) : (
                                        <button className="subscribe-button border w-full bg-gray-700 rounded-lg text-xl px-3 py-1.5">
                                            Subscribe
                                        </button>
                                    )
                                }
                            </div>
                        </div>


                        <div className='flex flex-row items-center gap-x-8  w-full text-gray-400'>
                            <span className="inline-flex items-center mr-2 cursor-pointer" title='Likes' onClick={toggleVideoLike}>
                                <ThumbsUp
                                    strokeWidth={3}
                                    absoluteStrokeWidth
                                    className={video.isLiked ? "me-2 text-blue-600" : "me-2"}
                                />
                                {video.likes}
                            </span>
                            <span className="inline-flex items-center mr-2" title='Views'>
                                <Eye
                                    strokeWidth={3}
                                    absoluteStrokeWidth
                                    className="me-2"
                                />
                                {video.views}
                            </span>
                            <span className="inline-flex items-center mr-2" title='Uploaded at'>
                                <CalendarArrowDown
                                    strokeWidth={3}
                                    absoluteStrokeWidth
                                    className="me-2"
                                />
                                {parseDate(video.createdAt)}
                            </span>
                            <span className="inline-flex items-center mr-2 cursor-pointer" title='Add to playlist'>
                                <List
                                    strokeWidth={3}
                                    absoluteStrokeWidth
                                    className="me-2"
                                />
                                Add
                            </span>
                        </div>

                        <p className="mt-4 line-clamp-6 text-gray-400 mb-4" title='video.description'>{video.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPage;
