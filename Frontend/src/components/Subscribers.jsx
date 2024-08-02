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

    const teamMembers = [
        {
            name: "Michael Foster",
            position: "Co-Founder / CTO",
            image: "path_to_image_1", // Replace with actual image path
        },
        {
            name: "Dries Vincent",
            position: "Business Relations",
            image: "path_to_image_2", // Replace with actual image path
        },
        {
            name: "Lindsay Walton",
            position: "Front-end Developer",
            image: "path_to_image_3", // Replace with actual image path
        },
        {
            name: "Courtney Henry",
            position: "Designer",
            image: "path_to_image_4", // Replace with actual image path
        },
        {
            name: "Tom Cook",
            position: "Director of Product",
            image: "path_to_image_5", // Replace with actual image path
        },
        {
            name: "Whitney Francis",
            position: "Copywriter",
            image: "path_to_image_6", // Replace with actual image path
        },
        {
            name: "Leonard Krasner",
            position: "Senior Designer",
            image: "path_to_image_7", // Replace with actual image path
        },
        {
            name: "Floyd Miles",
            position: "Principal Designer",
            image: "path_to_image_8", // Replace with actual image path
        },
        {
            name: "Emily Selman",
            position: "VP, User Experience",
            image: "path_to_image_9", // Replace with actual image path
        },
        {
            name: "Kristin Watson",
            position: "VP, Human Resources",
            image: "path_to_image_10", // Replace with actual image path
        },
        {
            name: "Emma Dorsey",
            position: "Senior Developer",
            image: "path_to_image_11", // Replace with actual image path
        },
        {
            name: "Alicia Bell",
            position: "Junior Copywriter",
            image: "path_to_image_12", // Replace with actual image path
        },
    ];

    return (
        <div className="bg-gray-900 text-white py-12">
            <h1 className="font-bold text-start text-5xl mt-7 mb-10">Your subscribers</h1>
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {
                        subscribers.length !== 0 ? (
                            subscribers.map(sub => (
                                <div key={sub._id} className="flex flex-col items-center">
                                    <img
                                        className="rounded-full h-24 w-24 object-cover mb-4"
                                        src={sub.subscriber.avatar}
                                        onError={e => e.target.src = img}
                                        alt= "profile pic"
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

