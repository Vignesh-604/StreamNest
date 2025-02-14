import img from "../assets/profile.webp"
import axios from "axios"
import { useState, useEffect } from "react"
import { useOutletContext, NavLink } from "react-router-dom";
import Loading from '../AppComponents/Loading';

export default function Subscribers({ channelId = "" }) {

    const currentUser = useOutletContext()
    const [loading, setLoading] = useState(true)

    const id = channelId === "" ? currentUser._id : channelId
    const [subscribers, setSubscribers] = useState([])

    useEffect(() => {
        axios.get(`/api/subscription/channel/${id}`)
            .then(res => {
                setSubscribers(res.data.data)
                setLoading(false)

            })
            .catch(e => console.log(e))
    }, [])

    if (loading) return <Loading />

    return (
        <div className="bg-[#0a0a26]/40 text-white px-6 py-8 min-h-screen">
            <div className="bg-[#24273a] rounded-lg p-8 mb-8">
                <h1 className="font-extrabold text-start text-4xl mb-10">Your Subscribers</h1>
                <div className="container mx-auto px-6">
                    <div className={subscribers.length !== 0 ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-6" : "flex justify-center"}>
                        {subscribers.length !== 0 ? (
                            subscribers.map(sub => (
                                <NavLink
                                    key={sub._id}
                                    to={sub.subscriber._id !== currentUser._id ? `/channel/${sub.subscriber._id}` : "/channel"}
                                    reloadDocument
                                    className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-950/40 bg-gray-900/50 transition-all duration-200 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
                                >
                                    <img
                                        className="rounded-full h-24 w-24 object-cover mb-4 border-2 border-[#8A3FFC]"
                                        src={sub.subscriber.avatar}
                                        onError={e => e.target.src = img}
                                        alt="profile pic"
                                    />
                                    <h3 className="text-lg font-semibold text-white">{sub.subscriber.fullname}</h3>
                                    <p className="text-gray-400">{sub.subscriber.username}</p>
                                </NavLink>
                            ))
                        ) : (
                            <h1 className="font-bold text-center text-3xl mt-7">You have no subscribers</h1>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

