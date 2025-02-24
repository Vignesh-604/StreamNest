import React, { useState, useEffect } from 'react';
import img from "../assets/thumbnail.jpg";
import axios from 'axios';
import { timeAgo } from '../Utils/utility';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import Loading from './Loading';
import { BadgeDollarSign } from 'lucide-react';

export default function Home() {
    const currentUser = useOutletContext() || {};
    const [videos, setVideos] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const { search } = useLocation();
    
    const pageLimit = Math.ceil(total / 12) || 1;

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/video/${search ? `${search}&` : "?"}page=${page}`)
            .then(res => {
                // Add error handling for the response structure
                if (res.data && res.data.data) {
                    const data = res.data.data;
                    setVideos(Array.isArray(data.videos) ? data.videos : []);
                    
                    // Safely handle the total count
                    if (data.total && Array.isArray(data.total) && data.total.length > 0) {
                        setTotal(data.total[0]?.total || 0);
                    } else {
                        setTotal(0);
                    }
                } else {
                    console.log("Invalid response structure:", res.data);
                    setVideos([]);
                    setTotal(0);
                }
            })
            .catch(e => {
                console.log("Error fetching videos:", e);
                setError("Failed to load videos");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [search, page]);

    const userChannel = (e, id) => {
        e.stopPropagation();
        // Guard against undefined id or currentUser
        if (!id) return;
        navigate(id !== (currentUser?._id || '') ? `/channel/${id}` : "/channel");
    };

    if (loading) return <Loading />;
    
    if (error) return (
        <div className="bg-[#0a0a26]/10 flex flex-col items-center justify-start p-4 mt-2.5 min-h-screen">
            <div className="text-center py-10 bg-[#1a1b1f] rounded-lg p-8 w-full max-w-screen-xl">
                <p className="text-xl text-red-400">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    // Function to safely get owner info
    const getOwnerInfo = (video) => {
        if (!video || !video.owner || !Array.isArray(video.owner) || video.owner.length === 0) {
            return { 
                _id: null, 
                fullname: "Unknown", 
                username: "unknown", 
                avatar: "" 
            };
        }
        return video.owner[0];
    };

    return (
        <div className="bg-[#0a0a26]/10 flex flex-col items-center justify-start p-4 mt-2.5">
            {videos?.length > 0 ? (
                <>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full max-w-screen-xl">
                        {videos.map(video => {
                            if (!video || !video._id) return null;
                            
                            const owner = getOwnerInfo(video);
                            
                            return (
                                <div
                                    key={video._id}
                                    className="card !bg-[#1a1b1f] "
                                    onClick={() => navigate(`/video/watch/${video._id}`)}
                                >
                                    <div className="relative">
                                        <img
                                            src={video.thumbnail ? video.thumbnail : img}
                                            alt={`Thumbnail for ${video.title || 'Untitled Video'}`}
                                            onError={(e) => e.target.src = img}
                                            className="w-full h-[200px] object-cover rounded-t-lg border-b border-b-gray-800"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                                            {video.duration ? Math.round(video.duration) : "00:00"}
                                        </div>
                                        {
                                            video.isExclusive && (
                                                <div className="absolute bottom-1 left-1 p-1 rounded-lg bg-black bg-opacity-40">
                                                    <BadgeDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 drop-shadow-lg stroke-2" />
                                                </div>
                                            )
                                        }
                                    </div>

                                    <div className="flex flex-row space-x-3 p-4">
                                        <img
                                            title={owner.fullname}
                                            src={owner.avatar || img}
                                            className="rounded-full object-cover w-10 h-10 min-w-[40px] mt-1 cursor-pointer hover:ring-2 hover:ring-purple-500"
                                            onClick={(e) => userChannel(e, owner._id)}
                                            onError={(e) => e.target.src = img}
                                        />

                                        <div className='flex-col'>
                                            <h3 className="text-white text-base font-medium line-clamp-2 mb-1" title={video.title || 'Untitled Video'}>
                                                {video.title || 'Untitled Video'}
                                            </h3>

                                            <p
                                                title={owner.fullname}
                                                className="text-gray-400 text-sm hover:text-purple-400 cursor-pointer"
                                                onClick={(e) => userChannel(e, owner._id)}
                                            >
                                                {owner.fullname} · @{owner.username}
                                            </p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {video.views || 0} views · {timeAgo(video.createdAt || new Date())}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="w-full border-t border-gray-800 mt-6 pt-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-gray-400 text-sm">
                            <div className="mb-4 md:mb-0">
                                <p>
                                    Showing <span className="text-white font-medium">{1 + ((page - 1) * 12)}</span> to <span className="text-white font-medium">{page * 12 > total ? total : page * 12}</span> of <span className="text-white font-medium">{total}</span> results
                                </p>
                            </div>
                            <div className="inline-flex items-center space-x-3">
                                <p className="mr-4">Page <span className="text-white font-medium">{page}</span> of <span className="text-white font-medium">{pageLimit}</span></p>
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    className="rounded-md bg-[#1a1b1f] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    ← Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={page >= pageLimit}
                                    onClick={() => setPage(prev => Math.min(pageLimit, prev + 1))}
                                    className="rounded-md bg-[#1a1b1f] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-color duration-200"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-gray-400 text-lg mt-10">
                    No videos found {search ? `for the given query "${search.replace("?query=", "")}"` : ""}
                </div>
            )}
        </div>
    );
}