import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoItem from "./VideoItem";
import { parseDate, parseTime, showCustomAlert, showConfirmAlert } from "../utility";
import { X } from "lucide-react"
import Loading from '../AppComponents/Loading';

export default function WatchHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/watchHistory/")
            .then((res) => {
                setHistory(groupVideosByDate(res.data.data));
                setLoading(false);
            })
            .catch(error => console.log(error));
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
                    .catch(error => console.log(error));
            }
        );
    };

    const groupVideosByDate = (videos) => {
        const groupedVideos = videos.reduce((acc, vid) => {
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
                                {dateGroup.videos.map((vid) => (
                                    <div key={vid._id} className="flex justify-between card">
                                        <VideoItem
                                            title={vid.video[0]?.title}
                                            description={vid.video[0]?.description}
                                            owner={vid.video[0]?.owner[0]}
                                            views={vid.video[0]?.views}
                                            thumbnail={vid.video[0]?.thumbnail}
                                            duration={parseTime(vid.video[0]?.duration)}
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
                                ))}
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