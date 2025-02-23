import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppComponents/Loading';
import { showConfirmAlert, showCustomAlert } from '../Utils/utility';

const VideoDetails = () => {
    const currentUser = useOutletContext();
    const [loading, setLoading] = useState(true);
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/purchase/info/${videoId}`)
            .then(res => {
                const { hasAccess, video } = res.data.data;
                if (!hasAccess) {
                    navigate(-1); // Redirect if the video is not purchased
                } else {
                    setVideo(video);
                    setLoading(false);
                }
            })
            .catch(error => console.log(error.response.data));
    }, [videoId]);
    

    const buyVideo = () => {
        showConfirmAlert(
            `Are you sure you wanna buy this Video for ₹${video.price}?`,
            "",
            () => {
                axios.get(`/api/purchase/buy/video/${videoId}`)
                    .then(res => {
                        showCustomAlert("Video purchased successfully")
                        navigate(`/video/watch/${videoId}`)
                    })
                    .catch(e => console.log(e.response.data))
            }
        )
    }

    if (loading) return <Loading />

    if (!video) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
                <div className="w-full max-w-4xl bg-white/5 p-8 rounded-2xl mx-auto">
                    <div className="text-center text-gray-400">Video not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
            <div className="w-full max-w-4xl bg-white/5 p-8 rounded-2xl mx-auto">
                {/* Preview/Thumbnail Section */}
                <div className="aspect-video bg-white/5 rounded-xl mb-6 flex items-center justify-center">
                    {video.thumbnail ? (
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover rounded-xl"
                        />
                    ) : (
                        <div className="text-gray-500">No preview available</div>
                    )}
                </div>

                {/* Video Information */}
                <div className="flex flex-col md:flex-row items-start gap-4">
                    {/* Creator Avatar */}
                    <div className="w-12 h-12 rounded-full flex-shrink-0">
                        <img
                            src={video.owner.avatar}
                            alt="creator"
                            className="rounded-full object-cover w-12 h-12 mt-2 min-w-[40px] cursor-pointer group hover:ring-2 hover:ring-purple-500"
                            onClick={(e) => navigate(video.owner._id !== currentUser._id ? `/channel/${video.owner._id}` : "/channel")}
                        />
                    </div>

                    {/* Title and Description */}
                    <div className="flex-grow">
                        <h1 className="text-white text-xl font-semibold mb-1">
                            {video.title}
                        </h1>
                        <div className="flex flex-col md:flex-row gap-1 md:items-center md:gap-2 text-sm text-gray-400 mb-4">
                            <p
                                title={video.owner.fullname}
                                className="text-gray-400 text-sm hover:text-purple-400 cursor-pointer"
                                onClick={(e) => navigate(video.owner._id !== currentUser._id ? `/channel/${video.owner._id}` : "/channel")}
                            >
                                {video.owner.fullname} • @{video.owner.username}
                            </p>
                            <span className="hidden md:inline">•</span>
                            <div className="flex gap-2 items-center">
                                <span>{video.views || 0} views</span>
                                <span className="inline">•</span>
                                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <p className="text-gray-400 mt-2 md:mt-0">{video.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                        {video.isExclusive && (
                            <div className="bg-white/5 px-4 py-2 rounded-xl mb-3">
                                <div className="text-green-400 font-medium">Exclusive Video</div>
                            </div>
                        )}
                        <button
                            className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-medium"
                            onClick={buyVideo}
                        >
                            Buy ${video.price}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoDetails;