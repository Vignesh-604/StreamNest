import { useState } from 'react';
import { NavLink, useParams, useNavigate, Outlet } from 'react-router-dom';
import { Menu, X, Home, UserCircle, ListVideo, ThumbsUp, Clock, CreditCard, UserSquare, LogOut, MonitorPlay, UserRoundCheck, NotepadText } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import logo from "../assets/Streamnest.png";
import profile from "../assets/profile.webp";

export default function Sidebar() {
    const { channelId } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const user = JSON.parse(Cookies.get("user"));

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const logout = () => {
        axios.post("/api/users/logout")
            .then(res => navigate("/"))
            .catch(e => console.log(e));
    };

    return (
        <div className="flex max-h-screen w-screen overflow-hidden bg-gray-950">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-950 border-r border-slate-700 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Top Section with Logo */}
                    <div className="flex items-center justify-between p-5 mx-auto">
                        <NavLink to="/home" className="-m-1.5 p-1.5">
                            <span className="sr-only">StreamNest</span>
                            <img src={logo} alt="Logo" className="h-28 " />
                        </NavLink>
                        <button className="text-white lg:hidden" onClick={toggleSidebar}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* User Profile Section */}
                    <NavLink to={"/channel"} className="flex items-center space-x-3 px-5 py-1 mb-6 shrink-0 hover: rounded-lg -my-5">
                        <img
                            src={user.avatar}
                            alt={user.username}
                            onError={(e) => e.target.src = profile}
                            className="h-12 w-12 rounded-full border-2 hover:border-emerald-500"
                        />
                        <div className="text-white">
                            <p className="font-semibold">{user.fullname}</p>
                            <p className="text-sm text-gray-400">@{user.username}</p>
                        </div>
                    </NavLink>

                    {/* Navigation Section */}
                    <div className="flex-1 overflow-y-auto px-5">
                        <nav className="space-y-6">
                            <div className="space-y-2 max-sm:space-y-1.5">
                                <label className="px-3 text-xs font-semibold uppercase text-gray-400">
                                    Navigation
                                </label>
                                <NavLink
                                    to="/home"
                                    className={({ isActive }) =>
                                        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-purple-500 text-white' : 'text-gray-200 hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <Home className="h-5 w-5 mr-3" />
                                    Home
                                </NavLink>
                                <NavLink
                                    to="/subscriptions"
                                    className={({ isActive }) =>
                                        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-purple-500 text-white' : 'text-gray-200 hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <CreditCard className="h-5 w-5 mr-3" />
                                    Subscriptions
                                </NavLink>
                                <NavLink
                                    to="/liked"
                                    className={({ isActive }) =>
                                        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-purple-500 text-white' : 'text-gray-200 hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <ThumbsUp className="h-5 w-5 mr-3" />
                                    Liked Videos
                                </NavLink>
                                <NavLink
                                    to="/history"
                                    className={({ isActive }) =>
                                        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-purple-500 text-white' : 'text-gray-200 hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <Clock className="h-5 w-5 mr-3" />
                                    Watch History
                                </NavLink>
                            </div>

                            <div className="space-y-2 max-sm:space-y-1.5">
                                <label className="px-3 text-xs font-semibold uppercase text-gray-400">
                                    My Channel
                                </label>
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) =>
                                        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-purple-500 text-white' : 'text-gray-200 hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <UserCircle className="h-5 w-5 mr-3" />
                                    Profile
                                </NavLink>
                                <NavLink
                                    to="/playlist"
                                    className={({ isActive }) =>
                                        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-purple-500 text-white' : 'text-gray-200 hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <ListVideo className="h-5 w-5 mr-3" />
                                    Playlists
                                </NavLink>
                                <NavLink
                                    to="/videos"
                                    className={({ isActive }) =>
                                        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-purple-500 text-white' : 'text-gray-200 hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <MonitorPlay className="h-5 w-5 mr-3" />
                                    Videos
                                </NavLink>
                                <NavLink
                                    to="/posts"
                                    className={({ isActive }) =>
                                        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-purple-500 text-white' : 'text-gray-200 hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <NotepadText className="h-5 w-5 mr-3" />
                                    Posts
                                </NavLink>
                                <NavLink
                                    to="/subscribers"
                                    className={({ isActive }) =>
                                        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-purple-500 text-white' : 'text-gray-200 hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <UserRoundCheck className="h-5 w-5 mr-3" />
                                    Subscribers
                                </NavLink>
                            </div>
                        </nav>
                    </div>

                    {/* Logout Section */}
                    <div className="px-5 py-4 border-t border-gray-700 shrink-0">
                        <button
                            onClick={logout}
                            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800 transition-colors duration-300"
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            Log out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 lg:hidden z-20"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden flex justify-between items-center p-4 bg-gray-900 text-white border-b border-slate-700 shrink-0">
                    <NavLink to="/home" className="flex items-center">
                        <img src={logo} alt="Logo" className="h-10 w-auto" />
                    </NavLink>
                    <button onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-950">
                    <Outlet context={JSON.parse(Cookies.get("user"))} />
                </div>
            </div>
        </div>
    );
}