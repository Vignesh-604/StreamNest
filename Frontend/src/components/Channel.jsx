import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { parseDate } from "./utility";
import axios from "axios";
import Playlists from "./Playlists";
import Subscribers from "./Subscribers";
import ChannelVideos from "./ChannelVideos";

export default function Channel({channelId = ""}) {
    const user = JSON.parse(Cookies.get("user"))
    const id = channelId === "" ? (JSON.parse(Cookies.get("user")))._id : channelId

    const [userStats, setUserStats] = useState({})
    

    const [toggle, setToggle] = useState("")

    useEffect(() => {
        axios.get(`/api/dashboard/stats/${id}`)
            .then(res => setUserStats(res.data.data))
            .catch(e => console.log(e))
    }, [])

    // Toggle which section to load
    const toggleState = (e) => toggle === e.currentTarget.id ? setToggle("") : setToggle(e.currentTarget.id)
    

    const stats = [
        { label: "Total Videos", value: userStats.totalVideos, id: "videos" },
        { label: "Total Playlists", value: userStats.totalPlaylists, id: "playlists" },
        { label: "Total Posts", value: userStats.totalPosts, id: "posts" },
        { label: "Total Subscribers", value: userStats.totalSubscribers, id: "subs" },
    ];

    return (
        <>
            <div className="flex flex-col xl:flex-row place-items-center pb-12">
                <div className="flex">
                    <div className="flex space-x-5 ps-5">
                        <img
                            src={user.avatar}
                            alt="User avatar"
                            className="h-56 rounded-full mb-4 border object-cover w-56"
                        />

                        <div className="items-center py-4 lg:w-[450px]">
                            <h1 className="text-4xl font-semibold m-2">
                                {user.fullname}
                            </h1>
                            <h2 className="text-xl text-gray-400 m-2">
                                {user.username}
                            </h2>
                            <hr className="ms-2 lg:me-10" />
                            <h2 className="text-lg text-gray-400 m-2">
                                Channel created at: {parseDate(user.createdAt)}
                            </h2>
                            <div className="flex flex-col ms-2 lg:me-10 max-lg:space-y-2 lg:flex-row lg:space-x-2">
                                <div className="flex w-full font-semibold border rounded-lg p-2 bg-slate-300 text-black">
                                    Total Views: {userStats.totalViews}
                                </div>
                                <div className="flex w-full font-semibold border rounded-lg p-2 bg-slate-300 text-black">
                                    Total Likes: {userStats.totalLikes}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-col max-lg:mt-4 w-[650px]">
                    <div className="bg-gray-900 text-white p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Your details</h2>
                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index}
                                    id={stat.id}
                                    className="bg-gray-800 p-4 rounded-lg shadow-md group hover:bg-gray-400 hover:text-black"
                                    onClick={toggleState}
                                >
                                    <div className="text-sm text-gray-400 group-hover:text-black">{stat.label}</div>
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                </div>
                                // Adding group Class: Add the group class to the parent div.
                                // This allows you to create a relationship between the parent and its children for styling purposes
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {toggle == "playlists" ? <Playlists /> : null}
            {toggle == "subs" ? <Subscribers /> : null}
            {toggle == "videos" ? <ChannelVideos /> : null}
            {/* {toggle == "subs" ? <Posts /> : null} */}
        </>
    );
}
