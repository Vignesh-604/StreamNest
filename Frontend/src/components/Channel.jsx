import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { parseDate } from "./utility";
import axios from "axios";

export default function Channel() {
    const user = JSON.parse(Cookies.get("user"))   // FOR TESTING
    const [userStats, setUserStats] = useState({})

    useEffect(() => {
        axios.get("/api/dashboard/stats")
        .then(res => setUserStats(res.data.data))
        .catch(e => console.log(e))
    }, [])
    console.log(userStats);

    const stats = [
        { label: "Total Videos", value: userStats.totalVideos },
        { label: "Total Playlists", value: userStats.totalPlaylists },
        { label: "Total Posts", value: userStats.totalPosts },
        { label: "Total Subscribers", value: userStats.totalSubscribers },
    ];

    return (
        <div>
            <div className="flex-row">
                <div className="flex space-x-5 px-5 lg:w-[800px]">
                    <img
                        src={user.avatar}
                        alt=""
                        className="h-56 rounded-full mb-4 border object-cover w-56"
                    />
                    <div className="items-center py-4 w-full">
                        <h1 className="text-4xl font-semibold m-2">
                            {user.fullname}
                        </h1>
                        <h2 className="text-xl text-gray-400 m-2">
                            {user.username}
                        </h2>
                        <hr className="ms-2 md:me-10" />
                        <h2 className="text-lg text-gray-400 m-2">
                            Channel created at: {parseDate(user.createdAt)}
                        </h2>
                        <div className="flex flex-col ms-2 md:me-10 max-md:space-y-2 md:flex-row md:space-x-2">
                            <div className="flex w-full font-semibold border rounded-lg p-2 bg-slate-300 text-black">
                                Total Views: {userStats.totalViews}
                            </div>
                            <div className="flex w-full font-semibold border rounded-lg p-2 bg-slate-300 text-black">
                                Total Likes: {userStats.totalLikes}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-col mt-4 lg:w-[800px]">
                    <div className="bg-gray-900 text-white p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Your details</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
