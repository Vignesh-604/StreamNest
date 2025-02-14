import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import Loading from '../AppComponents/Loading';
import { showCustomAlert, showConfirmAlert } from "../utility";

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
        <div className="flex flex-col items-center bg-[#0a0a26]/40 text-white px-6 py-8 min-h-screen">
            <div className="bg-[#24273a] rounded-lg p-8 mb-8 w-full ">
            <h1 className="font-extrabold text-start text-4xl mb-10">Your Subscriptions</h1>
            {subs.length !== 0 ? (
                <div className="grid xl:grid-cols-2 gap-8">
                    {subs.map(sub => (
                        <div key={sub._id}
                            onClick={() => navigate(sub.subscribedTo._id !== currentUser._id ? `/channel/${sub.subscribedTo._id}` : "/channel")}
                            className="flex flex-row items-center w-full p-4 card"
                        >
                            <img
                                src={sub.subscribedTo.avatar}
                                alt="Profile"
                                className="h-44 w-44 min-w-44 min-h-44 rounded-full object-cover border-2 border-[#8A3FFC]"
                            />
                            <div className="p-4 flex flex-col w-full">
                                <h1 className="text-2xl font-semibold text-white line-clamp-2">
                                    {sub.subscribedTo.fullname}
                                </h1>
                                <p className="mt-2 text-lg text-gray-400 line-clamp-2">
                                    @{sub.subscribedTo.username}
                                </p>
                                <p className="text-lg text-gray-300">
                                    {sub.subscribedTo.subscribers} subscribers
                                </p>

                                <button
                                    type="button"
                                    onClick={(e) => unsubscribe(e, sub.subscribedTo._id)}
                                    className="mx-auto mt-4 w-48 rounded-lg bg-[#8A3FFC] cursor-pointer px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#7B37EE] transition-all duration-200 hover:scale-105"
                                >
                                    Unsubscribe
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <h1 className="flex justify-center font-bold text-4xl mt-7 mb-10 text-white">No Subscriptions</h1>
            )}
        </div>
        </div>
    )
}