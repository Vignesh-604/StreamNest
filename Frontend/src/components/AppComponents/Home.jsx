import React, { useState, useEffect } from 'react';
import img from "../assets/thumbnail.jpg";
import axios from 'axios';
import { timeAgo } from '../Utils/utility';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import Loading from './Loading';
import { BadgeDollarSign } from 'lucide-react';

export default function Home() {
    const currentUser = useOutletContext()
    const [videos, setVideos] = useState([])
    const [total, setTotal] = useState(0)
    let pageLimit = Math.ceil(total / 12)
    let [page, setPage] = useState(1)
    const navigate = useNavigate()
    const { search } = useLocation()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/video/${search ? `${search}&` : "?"}page=${page}`)
            .then(res => {
                let data = res.data.data
                setVideos(data ? data.videos : [])
                setTotal(data.total[0]?.total || 0)
                setLoading(false);
            })
            .catch(e => console.log(e.response.data))
    }, [search, page])

    const userChannel = (e, id) => {
        e.stopPropagation()
        navigate(id !== currentUser._id ? `/channel/${id}` : "/channel")
    }

    if (loading) return <Loading />;

    return (
        <div className="bg-[#0a0a26]/10 flex flex-col items-center justify-start p-4 mt-2.5">
            {videos?.length > 0 ? (
                <>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full max-w-screen-xl">
                        {videos.map(video => (
                            <div
                                key={video._id}
                                className="card !bg-[#1a1b1f] "
                                onClick={() => navigate(`/video/watch/${video._id}`)}
                            >
                                <div className="relative">
                                    <img
                                        src={video.thumbnail ? video.thumbnail : img}
                                        alt={`Thumbnail for ${video.title}`}
                                        onError={(e) => e.target.src = img}
                                        className="w-full h-[200px] object-cover rounded-t-lg border-b border-b-gray-800"
                                    />
                                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                                        {Math.round(video.duration) || "00:00"}
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
                                        title={video.owner[0].fullname}
                                        src={video.owner[0].avatar}
                                        className="rounded-full object-cover w-10 h-10 min-w-[40px] mt-1 cursor-pointer hover:ring-2 hover:ring-purple-500"
                                        onClick={(e) => userChannel(e, video.owner[0]._id)}
                                    />

                                    <div className='flex-col'>
                                        <h3 className="text-white text-base font-medium line-clamp-2 mb-1" title={video.title}>
                                            {video.title}
                                        </h3>

                                        <p
                                            title={video.owner[0].fullname}
                                            className="text-gray-400 text-sm hover:text-purple-400 cursor-pointer"
                                            onClick={(e) => userChannel(e, video.owner[0]._id)}
                                        >
                                            {video.owner[0].fullname} · @{video.owner[0].username}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">{video.views} views · {timeAgo(video.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full border-t border-gray-800 mt-6 pt-4">
                        <div className="flex items-center justify-between text-gray-400 text-sm">
                            <div>
                                <p>
                                    Showing <span className="text-white font-medium">{1 + ((page - 1) * 12)}</span> to <span className="text-white font-medium">{page * 12 > total ? total : page * 12}</span> of <span className="text-white font-medium">{total}</span> results
                                </p>
                            </div>
                            <div className="inline-flex items-center space-x-3">
                                <p className="mr-4">Page <span className="text-white font-medium">{page}</span> of <span className="text-white font-medium">{pageLimit}</span></p>
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => setPage(--page)}
                                    className="rounded-md bg-[#1a1b1f] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    ← Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={page === pageLimit}
                                    onClick={() => setPage(++page)}
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
                    No videos found for the given query <span className="text-white">"{search.replace("?query=", "")}"</span>
                </div>
            )}
        </div>
    );
}
