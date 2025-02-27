import React, { useState, useEffect } from "react";
import { parseDate, showCustomAlert, showConfirmAlert } from "../Utils/utility";
import axios from "axios";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import Loading from "../AppComponents/Loading";
import { PencilLine, Users, NotepadText, UserRoundCheck, MonitorPlay, ThumbsUp, ListVideo, BellRing, UserPlus } from "lucide-react";
import EditProfileDialog from "./EditProfile";

export default function UserDetails() {
    const { channelId } = useParams();
    const currentUser = useOutletContext()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [userStats, setUserStats] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    let owner = user._id == currentUser._id

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = !channelId ? currentUser._id : channelId

                const userResponse = await axios.get(channelId ? `/api/users/channel/${channelId}` : "/api/users/current_user");
                const statsResponse = await axios.get(`/api/dashboard/stats/${channelId || id}`);

                setUser(userResponse.data.data);
                setUserStats(statsResponse.data.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                if (error.response?.status >= 500) navigate(-1);
            }
        };
        fetchData();
    }, [channelId]);

    const toggleSub = () => {
        if (user.isSubscribed) {
            showConfirmAlert(
                "Unsubscribe?",
                "Are you sure you want to unsubscribe from this channel?",
                () => {
                    axios.post(`/api/subscription/channel/${user._id}`)
                        .then(res => {
                            showCustomAlert("Unsubscribed!", "You have successfully unsubscribed.");
                            setUser({ ...user, isSubscribed: false });
                            setUserStats({ ...userStats, totalSubscribers: userStats.totalSubscribers - 1 });
                        })
                        .catch(e => console.log(e.response.data));
                }
            );
        } else {
            axios.post(`/api/subscription/channel/${user._id}`)
                .then(res => {
                    setUser({ ...user, isSubscribed: true });
                    setUserStats({ ...userStats, totalSubscribers: userStats.totalSubscribers + 1 });
                })
                .catch(e => console.log(e.response.data));
        }
    };

    const activityStats = [
        { label: "Liked Videos", value: user.likedVidCount || 0, link: "/liked", icon: <ThumbsUp className="w-8 h-8" /> },
        { label: "Playlists", value: user.playlists || 0, link: "/playlist", icon: <ListVideo className="w-8 h-8" /> },
        { label: "Subscriptions", value: user.subscriptions || 0, link: "/subscriptions", icon: <UserRoundCheck className="w-8 h-8" /> },
    ];

    const channelStats = [
        { label: "Videos", value: userStats.totalVideos || 0, link: "/videos", icon: <MonitorPlay className="w-8 h-8" /> },
        { label: "Posts", value: userStats.totalPosts || 0, link: "/post", icon: <NotepadText className="w-8 h-8" /> },
        { label: "Subscribers", value: userStats.totalSubscribers || 0, link: "/subscribers", icon: <Users className="w-8 h-8" /> },
    ];

    const otherChannelStats = [
        { label: "Videos", value: userStats.totalVideos || 0, link: `/videos/${channelId}`, icon: <MonitorPlay className="w-8 h-8" /> },
        { label: "Posts", value: userStats.totalPosts || 0, link: `/post/u/${channelId}`, icon: <NotepadText className="w-8 h-8" /> },
        { label: "Playlists", value: userStats.totalPlaylists || 0, link: `/playlist/u/${channelId}`, icon: <ListVideo className="w-8 h-8" /> },
    ];

    const CardContent = ({ icon, label, value }) => (
        <div className="flex items-start space-x-4">
            <div className="bg-[#7c3aed] bg-opacity-10 p-3 rounded-lg">{icon}</div>
            <div className="flex-1">
                <p className="text-sm text-gray-400">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-gray-500 mt-1">Click to view more</p>
            </div>
        </div>
    );

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-[#0a0a26]/40 text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-[#24273a] rounded-lg p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <img src={user.avatar} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-[#7c3aed]" />
                        <div className="flex-1">
                            <h1 className="text-4xl font-extrabold ">{user.fullname}</h1>
                            <p className="text-gray-400 font-bold text-lg ">@{user.username}</p>
                            <p className="text-gray-400 mt-2 mb-4">Joined: {parseDate(user.createdAt)}</p>

                            {
                                owner ? (
                                    <button onClick={() => setIsEditing(true)} className="flex items-center cursor-pointer gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] px-4 py-2 rounded-lg transition-colors">
                                        <PencilLine className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <button
                                        onClick={toggleSub}
                                        className={`group cursor-pointer relative flex items-center justify-center gap-2 w-48 py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 
                                            ${user.isSubscribed
                                                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                                            } shadow-lg hover:shadow-xl hover:shadow-purple-500/20`}
                                    >
                                        {user.isSubscribed ? (
                                            <>
                                                <BellRing className="w-5 h-5 transition-transform group-hover:scale-110" />
                                                <span className="transition-all">Subscribed</span>
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-7 h-7 transition-transform group-hover:scale-110" />
                                                <span className="transition-all text-xl">Subscribe</span>
                                            </>
                                        )}
                                    </button>
                                )
                            }

                        </div>
                    </div>
                </div>

                {
                    owner && (
                        <>
                            {/* Activity Section */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-4">My Activity</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {activityStats.map((stat, index) => (
                                        <div key={index} onClick={() => navigate(stat.link, { state: user })} className="bg-[#24273a] p-6 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                                            <CardContent icon={stat.icon} label={stat.label} value={stat.value} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )
                }


                {/* Channel Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">My Channel</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(owner ? channelStats : otherChannelStats).map((stat, index) => (
                            <div key={index} onClick={() => navigate(stat.link, { state: user })} className="bg-[#24273a] p-6 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                                <CardContent icon={stat.icon} label={stat.label} value={stat.value} />
                            </div>
                        ))}
                    </div>
                    <div className="border border-gray-700/30 mt-4 py-2 text-xl font-semibold flex felx-row rounded-lg bg-[#24273a]">
                        <h1 className="border-r pl-5 w-1/2">Total Likes: {userStats.totalLikes}</h1>
                        <h1 className="border-l pl-5 w-1/2">Total Views: {userStats.totalViews}</h1>
                    </div>
                </div>

                {/* Edit Profile Dialog */}
                <EditProfileDialog isOpen={isEditing} onClose={() => setIsEditing(false)} user={user} setUser={setUser} />
            </div>
        </div>
    );
}
