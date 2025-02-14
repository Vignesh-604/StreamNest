import React, { useState, useEffect } from "react";
import { parseDate } from "../utility";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../AppComponents/Loading";
import { PencilLine, Heart, PlaySquare, Users, Video, MessageSquare, UserPlus, NotepadText, UserRoundCheck, MonitorPlay, ThumbsUp, ListVideo } from "lucide-react";
import EditProfileDialog from "./EditProfile";

export default function UserDetails() {
    const { channelId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [userStats, setUserStats] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(channelId ? `/api/users/channel/${channelId}` : "/api/users/current_user");
                const statsResponse = await axios.get(`/api/dashboard/stats/${channelId || userResponse.data.data._id}`);

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

    const activityStats = [
        { label: "Liked Videos", value: user.likedVidCount || 0, link: "/liked", icon: <ThumbsUp className="w-8 h-8" /> },
        { label: "Playlists", value: user.playlists || 0, link: "/playlist", icon: <ListVideo className="w-8 h-8" /> },
        { label: "Subscriptions", value: user.subscriptions || 0, link: "/subscriptions", icon: <UserRoundCheck className="w-8 h-8" /> },
    ];

    const channelStats = [
        { label: "Videos", value: userStats.totalVideos || 0, link: "/videos", icon: <MonitorPlay className="w-8 h-8" /> },
        { label: "Posts", value: userStats.totalPosts || 0, link: "/posts", icon: <NotepadText className="w-8 h-8" /> },
        { label: "Subscribers", value: userStats.totalSubscribers || 0, link: "/subscribers", icon: <Users className="w-8 h-8" /> },
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

                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] px-4 py-2 rounded-lg transition-colors">
                                <PencilLine className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Activity Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">My Activity</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {activityStats.map((stat, index) => (
                            <div key={index} onClick={() => navigate(stat.link)} className="bg-[#24273a] p-6 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                                <CardContent icon={stat.icon} label={stat.label} value={stat.value} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Channel Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">My Channel</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {channelStats.map((stat, index) => (
                            <div key={index} onClick={() => navigate(stat.link)} className="bg-[#24273a] p-6 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                                <CardContent icon={stat.icon} label={stat.label} value={stat.value} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Edit Profile Dialog */}
                <EditProfileDialog isOpen={isEditing} onClose={() => setIsEditing(false)} user={user} setUser={setUser} />
            </div>
        </div>
    );
}
