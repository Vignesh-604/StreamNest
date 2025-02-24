import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoItem from "./VideoItem";
import { parseDate, parseTime, showCustomAlert, showConfirmAlert } from "../Utils/utility";
import { X } from "lucide-react"
import Loading from '../AppComponents/Loading';

export default function WatchHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get("/api/watchHistory/")
            .then((res) => {
                // Check if data exists and has the expected structure
                if (res.data && res.data.data) {
                    setHistory(groupVideosByDate(res.data.data));
                } else {
                    console.log("Invalid response structure:", res.data);
                    setHistory([]);
                }
            })
            .catch(error => {
                console.log("Error fetching watch history:", error);
                setError("Failed to load watch history");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const remove = (id) => {
        showConfirmAlert(
            "Remove Video?",
            "Are you sure you want to remove this video from your watch history? This action cannot be undone.",
            () => {
                axios.delete(`/api/watchHistory/remove/${id}`)
                    .then(() => {
                        showCustomAlert("Removed!", "Video has been removed from your watch history.");
                        setHistory(history.map(dateGroup => ({
                            date: dateGroup.date,
                            videos: dateGroup.videos.filter(vid => vid._id !== id)
                        })).filter(dateGroup => dateGroup.videos.length > 0));
                    })
                    .catch(error => {
                        console.log("Error removing video:", error);
                        showCustomAlert("Error", "Failed to remove video. Please try again.");
                    });
            }
        );
    };

    const groupVideosByDate = (videos) => {
        if (!Array.isArray(videos)) {
            console.log("Videos data is not an array:", videos);
            return [];
        }

        const groupedVideos = videos.reduce((acc, vid) => {
            // Skip invalid entries
            if (!vid || !vid.watchedAt) return acc;
            
            const date = parseDate(vid.watchedAt);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(vid);
            return acc;
        }, {});

        return Object.keys(groupedVideos).map(date => ({
            date,
            videos: groupedVideos[date]
        }));
    };

    if (loading) return <Loading />;
    if (error) return (
        <div className="flex flex-col items-center bg-[#0a0a26]/40 text-white px-6 py-8 min-h-screen">
            <div className="bg-[#24273a] rounded-lg p-8 mb-8 w-full">
                <h1 className="font-extrabold text-start text-4xl mb-10">Watch History</h1>
                <div className="text-center py-10">
                    <p className="text-xl text-red-400">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center bg-[#0a0a26]/40 text-white px-6 py-8 min-h-screen">
            <div className="bg-[#24273a] rounded-lg p-8 mb-8 w-full ">
                <h1 className="font-extrabold text-start text-4xl mb-10">Watch History</h1>

                {history.length ? (
                    history.map((dateGroup) => (
                        <div key={dateGroup.date}>
                            <hr className="mb-1 mt-4 opacity-20" />
                            <h1 className="font-bold text-2xl mb-4">{dateGroup.date}</h1>
                            <div className="grid gap-6 lg:grid-cols-2">
                                {dateGroup.videos.map((vid) => {
                                    // Skip rendering if video data is missing
                                    if (!vid || !vid.video || !vid.video[0]) {
                                        return null;
                                    }
                                    
                                    // Safely access owner data
                                    const videoData = vid.video[0];
                                    const owner = videoData.owner && videoData.owner[0] ? videoData.owner[0] : null;
                                    
                                    return (
                                        <div key={vid._id} className="flex justify-between card">
                                            <VideoItem
                                                title={videoData.title || "Untitled Video"}
                                                description={videoData.description || ""}
                                                owner={owner}
                                                views={videoData.views || 0}
                                                thumbnail={videoData.thumbnail || ""}
                                                duration={videoData.duration ? parseTime(videoData.duration) : "00:00"}
                                            />
                                            <div className="flex items-start mt-6">
                                                <button
                                                    onClick={() => remove(vid._id)}
                                                    className="flex justify-center md:items-center transform hover:scale-120"
                                                    title="Remove video"
                                                >
                                                    <X className="m-2 h-7 w-7 text-white hover:bg-gray-500/20 hover:bg-opacity-15 rounded-xl" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <h1 className="flex place-content-center font-bold text-4xl my-7">No Watch History</h1>
                )}
            </div>
        </div>
    );
}