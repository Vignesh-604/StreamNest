import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import VideoItem from "../Video/VideoItem";
import { parseDate, parseTime } from "../Utils/utility";
import Loading from "../AppComponents/Loading";
import { ListVideo, Upload } from "lucide-react";

const PurchaseHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/purchase/track")
            .then((res) => {
                const data = res.data.data
                data && setHistory(formatPurchaseHistory(data))
                setLoading(false)
            })
            .catch(error => console.log(error.response.data))
    }, []);

    const formatPurchaseHistory = (data) => {
        const purchases = []

        // Inside formatPurchaseHistory function
        const standardVideos = data.purchasedVideos.filter(pv => !pv.playlistId);
        if (standardVideos.length) {
            purchases.push({
                title: "Purchased Videos",
                items: standardVideos.map(pv => ({
                    _id: pv.videoId._id,
                    title: pv.videoId.title,
                    thumbnail: pv.videoId.thumbnail,
                    duration: parseTime(pv.videoId.duration),
                    owner: pv.videoId.owner,
                    views: pv.videoId.views,
                    amount: pv.amount,
                    purchasedAt: parseDate(pv.purchasedAt)
                }))
            });
        }

        // For playlist videos
        const playlistVideos = data.purchasedVideos.filter(pv => pv.playlistId);
        if (playlistVideos.length) {
            purchases.push({
                title: "Playlist Videos",
                items: playlistVideos.map(pv => ({
                    _id: pv.videoId._id,
                    title: pv.videoId.title,
                    thumbnail: pv.videoId.thumbnail,
                    duration: parseTime(pv.videoId.duration),
                    owner: pv.videoId.owner,
                    views: pv.videoId.views,
                    purchasedAt: parseDate(pv.purchasedAt),
                    playlistInfo: {
                        playlistId: pv.playlistId._id,
                        name: pv.playlistId.name,
                        ownerId: pv.playlistId.owner._id
                    }
                }))
            });
        }

        // Handle purchased playlists
        if (data.purchasedPlaylists.length) {
            purchases.push({
                title: "Purchased Playlists",
                items: data.purchasedPlaylists.map(pp => ({
                    _id: pp.playlistId._id,
                    title: pp.playlistId.name,
                    owner: pp.playlistId.owner,
                    amount: pp.amount,
                    purchasedAt: parseDate(pp.purchasedAt)
                }))
            });
        }

        // Handle purchased uploads
        if (data.purchasedUploads.length) {
            purchases.push({
                title: "Purchased Uploads",
                items: data.purchasedUploads.map(pu => ({
                    _id: pu._id,
                    uploadCount: pu.uploadCount,
                    amount: pu.amount,
                    purchasedAt: parseDate(pu.purchasedAt)
                }))
            });
        }

        return purchases;
    };

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col items-center bg-[#0a0a26]/40 text-white px-6 py-8 min-h-full">
            <div className="bg-[#24273a] rounded-lg p-8 mb-8 w-full">
                <h1 className="font-extrabold text-start text-4xl mb-10">Purchase History</h1>

                {history.length ? (
                    history.map((section) => (
                        <div key={section.title}>
                            <hr className="mb-1 mt-4 opacity-20" />
                            <h1 className="font-bold text-2xl mb-4">{section.title}</h1>
                            <div className="grid gap-6 lg:grid-cols-2">
                                {section.items.map((item) => (
                                    <div key={item._id} className="flex flex-col bg-[#1e2030] rounded-lg p-4">
                                        {(section.title === "Purchased Videos" || section.title === "Playlist Videos") && (
                                            <VideoItem
                                                id={item._id}
                                                title={item.title}
                                                thumbnail={item.thumbnail}
                                                duration={item.duration}
                                                owner={item.owner}
                                                views={item.views}
                                                purchasedAt={item.purchasedAt}
                                                amount={item.amount}
                                                playlistInfo={item.playlistInfo}
                                            />
                                        )}

                                        {section.title === "Purchased Playlists" && (
                                            <Link to={`/playlist/u/${item.owner._id}/p/${item._id}`} className="flex items-center">
                                                
                                                <ListVideo className="h-20 w-20 rounded-lg bg-purple-600/50 mr-2" />
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-bold">{item.title}</h3>
                                                    <p className="text-sm text-purple-400 font-semibold hover:underline">By {item.owner.fullname} (@{item.owner.username})</p>
                                                    <p className="text-sm text-gray-400">Amount Paid: ${item.amount}</p>
                                                    <p className="text-sm text-gray-400">Purchased on: {item.purchasedAt}</p>
                                                </div>
                                            </Link>
                                        )}

                                        {section.title === "Purchased Uploads" && (
                                            <div className="flex items-center">
                                                <Upload className="h-20 w-20 rounded-lg bg-purple-600/50 mr-2" />
                                                <div className="flex flex-col space-y-1">
                                                    <h3 className="text-lg font-bold">Video Uploads</h3>
                                                    <p className="text-sm">Upload Count: {item.uploadCount}</p>
                                                    <p className="text-sm">Amount Paid: ${item.amount}</p>
                                                    <p className="text-xs text-gray-400">Purchased on: {item.purchasedAt}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <h1 className="flex place-content-center font-bold text-4xl my-7">No Purchase History</h1>
                )}
            </div>
        </div>
    );
};

export default PurchaseHistory;