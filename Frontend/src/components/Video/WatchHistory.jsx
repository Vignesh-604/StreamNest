import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoItem from "./VideoItem";
import { parseDate, parseTime, showCustomAlert, showConfirmAlert } from "../Utils/utility";
import { X } from "lucide-react";
import Loading from '../AppComponents/Loading';

export default function WatchHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get("/api/watchHistory")
            .then((res) => {
                // More robust data validation
                if (res.data) {
                    // Handle different possible response structures
                    const videoData = res.data.data || res.data || [];
                    
                    // Ensure we have an array to work with
                    const validVideos = Array.isArray(videoData) ? videoData : [];
                    
                    if (validVideos.length > 0) {
                        setHistory(groupVideosByDate(validVideos));
                    } else {
                        console.log("No videos found in response:", res.data);
                        setHistory([]);
                    }
                } else {
                    console.log("Invalid response:", res.data);
                    setHistory([]);
                }
            })
            .catch(error => {
                console.error("Error fetching watch history:", error);
                setError("Failed to load watch history. Please try again later.");
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
                    .then((res) => {
                        showCustomAlert("Removed!", "Video has been removed from your watch history.");
                        
                        // Update state after successful removal
                        setHistory(prevHistory => 
                            prevHistory.map(dateGroup => ({
                                date: dateGroup.date,
                                videos: dateGroup.videos.filter(vid => vid._id !== id)
                            })).filter(dateGroup => dateGroup.videos.length > 0)
                        );
                    })
                    .catch(error => {
                        console.error("Error removing video:", error);
                        showCustomAlert("Error", "Failed to remove video. Please try again.");
                    });
            }
        );
    };

    const groupVideosByDate = (videos) => {
        if (!Array.isArray(videos)) {
            console.error("Videos data is not an array:", videos);
            return [];
        }

        const groupedVideos = videos.reduce((acc, vid) => {
            // Handle missing data more gracefully
            if (!vid) return acc;
            
            // Ensure watchedAt exists with a fallback
            const watchDate = vid.watchedAt || new Date().toISOString();
            const date = parseDate(watchDate);
            
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(vid);
            return acc;
        }, {});

        // Sort dates in descending order (newest first)
        return Object.keys(groupedVideos)
            .sort((a, b) => new Date(b) - new Date(a))
            .map(date => ({
                date,
                videos: groupedVideos[date]
            }));
    };

    // Helper function to safely extract video data
    const getVideoData = (vid) => {
        if (!vid) return null;
        
        // Handle different possible data structures
        if (vid.video && Array.isArray(vid.video) && vid.video[0]) {
            return vid.video[0];
        } else if (vid.video && typeof vid.video === 'object') {
            return vid.video;
        } else if (vid.videoData) {
            return vid.videoData;
        }
        
        return null;
    };

    // Helper function to safely extract owner data
    const getOwnerData = (videoData) => {
        if (!videoData) return null;
        
        if (videoData.owner && Array.isArray(videoData.owner) && videoData.owner[0]) {
            return videoData.owner[0];
        } else if (videoData.owner && typeof videoData.owner === 'object') {
            return videoData.owner;
        } else if (videoData.ownerData) {
            return videoData.ownerData;
        }
        
        return null;
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
            <div className="bg-[#24273a] rounded-lg p-8 mb-8 w-full">
                <h1 className="font-extrabold text-start text-4xl mb-10">Watch History</h1>

                {history.length > 0 ? (
                    history.map((dateGroup) => (
                        <div key={dateGroup.date}>
                            <hr className="mb-1 mt-4 opacity-20" />
                            <h1 className="font-bold text-2xl mb-4">{dateGroup.date}</h1>
                            <div className="grid gap-6 lg:grid-cols-2">
                                {dateGroup.videos.map((vid) => {
                                    if (!vid) return null;
                                    
                                    const videoData = getVideoData(vid);
                                    if (!videoData) return null;
                                    
                                    const owner = getOwnerData(videoData);
                                    
                                    return (
                                        <div key={vid._id} className="flex justify-between card">
                                            <VideoItem
                                                id= {videoData._id}
                                                title={videoData.title || "Untitled Video"}
                                                description={videoData.description || ""}
                                                owner={owner}
                                                views={videoData.views || 0}
                                                thumbnail={videoData.thumbnail || ""}
                                                duration={videoData.duration ? parseTime(videoData.duration) : "00:00"}
                                                videoId={videoData._id || vid.videoId || ""}
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