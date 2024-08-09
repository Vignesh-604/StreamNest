import React, { useState, useEffect } from "react";
import { parseDate } from "../utility";
import img from "../assets/profile.webp"
import axios from "axios";
import Playlists from "../Playlist/Playlists"
import Subscribers from "../Subscription/Subscribers";
import ChannelVideos from "../Video/ChannelVideos";
import PostList from "../Post/PostList";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import ReactLoading from 'react-loading';

export default function Channel() {//66afcbb1791f57ba50bea9cb
    const currentUser = useOutletContext()   
    const {channelId} = useParams()
    const navigate = useNavigate()

    const [user, setUser] = useState({})
    const [userStats, setUserStats] = useState({})
    
    const [toggle, setToggle] = useState("")

    const [loading, setLoading] = useState(true);  // Add loading state
    
    useEffect(() => {
        const id = !channelId ? currentUser._id : channelId  

        axios.get(`/api/users/channel/${id}`)
            .then(res => {setUser(res.data.data)})
            .catch(error => error.response.status >= 500 ? navigate(-1) : console.log(error.response.data))

        axios.get(`/api/dashboard/stats/${id}`)
            .then(res => {
                setUserStats(res.data.data)
                setLoading(false)
            })
            .catch(error => error.response.status >= 500 ? navigate(-1) : console.log(error.response.data));
            
    }, [])

    // Toggle which section to load
    const toggleState = (e) => toggle === e.currentTarget.id ? setToggle("") : setToggle(e.currentTarget.id)

    const stats = [
        { label: "Total Videos", value: userStats.totalVideos || 0, id: "videos" },
        { label: "Total Playlists", value: userStats.totalPlaylists || 0, id: "playlists" },
        { label: "Total Posts", value: userStats.totalPosts || 0, id: "posts" },
        { label: "Total Subscribers", value: userStats.totalSubscribers || 0, id: "subs" },
    ];

    if (loading) return <ReactLoading type={'spin'} />;

    return (
        <>
            <div className="flex flex-col xl:flex-row place-items-center pb-12 rounded-md" 
                  style={user.coverImage ? {
                    backgroundImage: `url(${user.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  } : null}
            >
                <div className="flex">
                    <div className="flex space-x-5 ps-5">
                        <img
                            src={user.avatar}
                            alt="User avatar"
                            onError={e => e.target.src = img}
                            className="h-56 rounded-full mb-4 border object-cover w-56"
                        />

                        <div className="items-center py-4 lg:w-[450px]">
                            <h1 className="text-4xl font-semibold m-2">
                                {user.fullname}
                            </h1>
                            <h2 className="text-xl text-gray-400 m-2">
                                @{user.username}
                            </h2>
                            <hr className="ms-2 lg:me-10" />
                            <h2 className="text-lg text-gray-400 m-2">
                                Channel created at: {parseDate(user.createdAt)}
                            </h2>
                            <div className="flex flex-col ms-2 lg:me-10 max-lg:space-y-2 lg:flex-row lg:space-x-2">
                                {userStats.totalVideos == 0 ? (
                                    <div>
                                        <div className="flex w-full font-semibold border rounded-lg p-2 bg-slate-300 text-black">
                                            User does not have a channel
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex w-full font-semibold border rounded-lg p-2 bg-slate-300 text-black">
                                            Total Views: {userStats.totalViews}
                                        </div>
                                        <div className="flex w-full font-semibold border rounded-lg p-2 bg-slate-300 text-black">
                                            Total Likes: {userStats.totalLikes}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={userStats.totalVideos != 0 ? "flex-col max-lg:mt-4 w-[650px]" : "hidden"}>
                    <div className=" text-white p-6 rounded-lg">
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
            
            {toggle == "playlists" ? <Playlists channelId={channelId}/> : null}
            {toggle == "subs" ? <Subscribers  channelId={channelId}/> : null}
            {toggle == "videos" ? <ChannelVideos owner={user}/> : null}
            {toggle == "posts" ? <PostList channelId={channelId} owner={user}/> : null}
        </>
    );
}
