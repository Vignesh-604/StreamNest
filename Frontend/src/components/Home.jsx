import React, { useState, useEffect } from 'react';
import img from "./assets/thumbnail.jpg"
import axios from 'axios';
import { timeAgo } from './utility';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import Loading from './AppComponents/Loading';

export default function Home() {

    const currentUser = useOutletContext()
    const [videos, setVideos] = useState([])

    const [total, setTotal] = useState([])
    let pageLimit = Math.ceil(total / 12)
    let [page, setPage] = useState(1)

    const navigate = useNavigate()
    const { search } = useLocation()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`/api/video/${search ? `${search}&` : "?"}page=${page}`)      // search query then /?query=abc&page=1 else /?page=1
            .then(res => {
                setVideos(res.data.data.videos)
                setTotal(res.data.data.total[0].total)
                setLoading(false)

            })
            .catch(e => console.log(e.response.data))
    }, [search, page])

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start mb-10">
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

                            <img
                                title={video.owner[0].fullname}
                                src={video.owner[0].avatar}
                                className="rounded-full object-cover w-12 h-12 min-w-[12px] mt-1 cursor-pointer"
                                onClick={() => navigate(video.owner[0]._id !== currentUser._id ? `/channel/${video.owner[0]._id}` : "/channel")}
                            />

                            <div className='flex-col w-[220px]'>
                                <h3 className="text-white text-lg font-semibold line-clamp-2 " title={video.title}>
                                    {video.title}
                                </h3>

                                <p
                                    title={video.owner[0].fullname}
                                    className="text-gray-400 cursor-pointer"
                                    onClick={() => navigate(video.owner[0]._id !== currentUser._id ? `/channel/${video.owner[0]._id}` : "/channel")}
                                >
                                    {video.owner[0].fullname} · @{video.owner[0].username}
                                </p>
                                <p className="text-gray-400">{video.views} views · {timeAgo(video.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full border-t border-gray-300 mt-2">
                <div className="mt-2 flex items-center justify-between">
                    <div>
                        <p>
                            showing <strong>{1 + ((page - 1) * 12)}</strong> to <strong>{page * 12 > total ? total : page * 12}</strong> of <strong>{total}</strong> results

                        </p>
                    </div>
                    <div className="inline-flex items-center space-x-2">
                        <p className='me-4'>Page <strong>{page}</strong> of <strong>{pageLimit}</strong></p>
                        <button
                            type="button" disabled={page <= 1 ? true : false} onClick={() => setPage(--page)}
                            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/30"
                        >
                            ← Previous
                        </button>
                        <button
                            type="button" disabled={page === pageLimit ? true : false} onClick={() => setPage(++page)}
                            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/30"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
