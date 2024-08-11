import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoItem from "./VideoItem";
import { parseDate, parseTime } from "../utility";
import { XMarkIcon } from "@heroicons/react/24/outline";
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
        axios.delete(`/api/watchHistory/remove/${id}`)
            .then(() => {
                // Filter out the removed video from the history state
                setHistory(history.map(dateGroup => ({
                    date: dateGroup.date,
                    videos: dateGroup.videos.filter(vid => vid._id !== id)
                })).filter(dateGroup => dateGroup.videos.length > 0));
            })
            .catch(error => console.log(error));
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
        <div className="flex flex-col items-center px-4 min-w-[36rem]">
            <h1 className="font-bold text-start text-5xl mt-7 mb-10">Watch History</h1>

            {history.length ? (
                history.map((dateGroup) => (
                    <div key={dateGroup.date}>
                        <h1 className="font-bold text-2xl mb-4">{dateGroup.date}</h1>
                        <div className="grid gap-6 lg:grid-cols-2">
                            {dateGroup.videos.map((vid) => (
                                <div key={vid._id} className="flex justify-between">
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
                                            className="flex justify-center md:items-center"
                                            title="Remove video"
                                        >
                                            <XMarkIcon className="m-2 h-7 w-7 text-white hover:bg-gray-500 hover:bg-opacity-15 rounded-xl" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <h1 className="flex place-content-center font-bold text-5xl my-7">No Watch History</h1>
            )}
        </div>
    );
}
