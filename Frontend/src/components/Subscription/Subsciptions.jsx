import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import Loading from '../AppComponents/Loading';

export default function Subscriptions() {
    
    const currentUser = useOutletContext()
    const [subs, setSubs] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`/api/subscription`)
            .then(res => {
                setSubs(res.data.data)
                setLoading(false)
            })
            .catch(e => console.log(e))
    }, [])
    // console.log(subs);

    const unsubscribe = (e, id) => {
        e.stopPropagation()
        axios.post(`/api/subscription/channel/${id}`)
            .then(res => {
                //alert
                setSubs(subs => subs.filter(sub => sub.subscribedTo._id !== id))
            })
            .catch(e => console.log(e))
    }
    
    if (loading) return <Loading />

    return (
        <div className="flex flex-col items-center px-4 ">
            <h1 className="font-bold text-start text-5xl mt-7 mb-10">Subscriptions</h1>
            <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-2">

                {
                    subs.length !== 0 ? (
                        subs.map(sub => (
                            <div key={sub._id}
                                onClick={() => navigate(sub.subscribedTo._id !== currentUser._id ? `/channel/${sub.subscribedTo._id}` : "/channel")}
                                className="flex flex-row items-center w-[500px] p-2 shadow-lg rounded-md cursor-pointer hover:bg-gray-800"
                            >
                                <img
                                    src={sub.subscribedTo.avatar}
                                    alt="Laptop"
                                    className="h-44 w-44 min-w-44 min-h-44 rounded-full object-cover"
                                />
                                <div className="p-4 flex flex-col w-full">
                                    <h1 className="text-2xl font-semibold line-clamp-2">
                                        {sub.subscribedTo.fullname}
                                    </h1>
                                    <p className="mt-2 text-lg text-gray-400 line-clamp-2">
                                        @{sub.subscribedTo.username}
                                    </p>
                                    <p className="text-lg text-gray-300">
                                        {sub.subscribedTo.subscribers} subscribers
                                    </p>

                                    <button
                                        type="button" onClick={(e) => unsubscribe(e, sub.subscribedTo._id)}
                                        className="mx-auto mt-4 w-48 rounded-sm bg-black px-2 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                    >
                                        Unsubscribe
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        null
                    )
                }
            </div>
        </div>
    )
}