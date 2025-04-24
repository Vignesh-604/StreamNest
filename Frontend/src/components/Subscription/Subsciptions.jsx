import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import Loading from '../AppComponents/Loading';
import { showCustomAlert, showConfirmAlert } from "../Utils/utility";

export default function Subscriptions() {
    const currentUser = useOutletContext();
    const [subs, setSubs] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/subscription`)
            .then(res => {
                setSubs(res.data.data);
                setLoading(false);
            })
            .catch(e => console.log(e));
    }, []);

    const unsubscribe = (e, id) => {
        e.stopPropagation();

        showConfirmAlert(
            "Unsubscribe?",
            "Are you sure you want to unsubscribe from this channel?",
            () => {
                axios.post(`/api/subscription/channel/${id}`)
                    .then(() => {
                        showCustomAlert("Unsubscribed!", "You have successfully unsubscribed.");
                        setSubs((subs) => subs.filter(sub => sub.subscribedTo._id !== id));
                    })
                    .catch(e => console.log(e));
            }
        );
    };

    if (loading) return <Loading />

    return (
        <div className="flex flex-col items-center bg-[#0a0a26]/40 text-white px-3 sm:px-6 py-6 sm:py-8 min-h-screen">
            <div className="bg-[#24273a] rounded-lg p-4 sm:p-8 mb-8 w-full max-w-6xl">
                <h1 className="font-extrabold text-start text-3xl sm:text-4xl mb-6 sm:mb-10">Your Subscriptions</h1>
                {subs.length !== 0 ? (
                    <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {subs.map(sub => (
                            <div key={sub._id}
                                onClick={() => navigate(sub.subscribedTo._id !== currentUser._id ? `/channel/${sub.subscribedTo._id}` : "/channel")}
                                className="flex flex-row items-center w-full p-3 sm:p-4 card bg-[#1d1f33] rounded-lg hover:bg-[#2b2e4a] transition-colors cursor-pointer"
                            >
                                {/* Smaller image that scales with screen size */}
                                <img
                                    src={sub.subscribedTo.avatar}
                                    alt="Profile"
                                    className="h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full object-cover border-2 border-[#8A3FFC] flex-shrink-0"
                                />
                                
                                {/* Content section with proper spacing */}
                                <div className="pl-3 sm:pl-4 flex flex-col w-full overflow-hidden">
                                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white truncate">
                                        {sub.subscribedTo.fullname}
                                    </h1>
                                    <p className="mt-0.5 sm:mt-1 text-sm sm:text-base text-gray-400 truncate">
                                        @{sub.subscribedTo.username}
                                    </p>
                                    <p className="text-sm sm:text-base text-gray-300">
                                        {sub.subscribedTo.subscribers} subscribers
                                    </p>

                                    <button
                                        type="button"
                                        onClick={(e) => unsubscribe(e, sub.subscribedTo._id)}
                                        className="mt-2 sm:mt-3 w-full sm:w-auto rounded-lg bg-[#8A3FFC] cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#7B37EE] transition-all duration-200 hover:scale-105"
                                    >
                                        Unsubscribe
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h1 className="flex justify-center font-bold text-2xl sm:text-4xl mt-5 sm:mt-7 mb-6 sm:mb-10 text-white">No Subscriptions</h1>
                )}
            </div>
        </div>
    )
}