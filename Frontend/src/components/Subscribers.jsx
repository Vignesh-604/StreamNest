import img from "../assets/profile.webp"
import Cookies from "js-cookie"
import axios from "axios"
import { useState, useEffect } from "react"

export default function Subscribers({ channelId = "" }) {

    const id = channelId === "" ? (JSON.parse(Cookies.get("user")))._id : channelId

    const [subscribers, setSubscribers] = useState([])

    useEffect(() => {
        axios.get(`/api/subscription/channel/${id}`)
            .then(res => setSubscribers(res.data.data))
            .catch(e => console.log(e))
    }, [])

    return (
        <div className="bg-gray-900 text-white px-4">
            <h1 className="font-bold text-start text-5xl mt-7 mb-10">Subscribers</h1>
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-6">
                    {
                        subscribers.length !== 0 ? (
                            subscribers.map(sub => (
                                <div key={sub._id} className="flex flex-col items-center">
                                    <img
                                        className="rounded-full h-24 w-24 object-cover mb-4"
                                        src={sub.subscriber.avatar}
                                        onError={e => e.target.src = img}
                                        alt="profile pic"
                                    />
                                    <h3 className="text-lg font-semibold">{sub.subscriber.fullname}</h3>
                                    <p className="text-gray-400">{sub.subscriber.username}</p>
                                </div>
                            ))
                        ) : (
                            <h1 className="font-bold text-center text-3xl mt-7">You have no subs</h1>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

