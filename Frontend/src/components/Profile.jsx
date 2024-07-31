import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { parseDate } from "./utility";
import { PencilIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function Profile() {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({})
    const [file, setFile] = useState("")

    useEffect(() => {
        axios.get("/api/users/current_user")
            .then(res => {
                setUser(res.data.data)
                setFormData({
                    fullname: res.data.data.fullname,
                    email: res.data.data.email,
                })
            })
            .catch(e => console.log(e))
    }, [])


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.fullname !== user.fullname || formData.email !== user.email) {

            axios.patch("/api/users/update_details", {
                fullname: formData.fullname,
                email: formData.email
            })
                .then(res => setUser(res.data.data))
                .catch(e => console.log(e))
        }

        if (file) {
            const form = new FormData()
            form.append("avatar", file)

            axios.patchForm("/api/users/update_avatar",{
                "avatar": file
            })
                .then(res => setUser(res.data.data))
                .catch(e => console.log(e))
        }

        // After updating, you might want to close the form
        setIsEditing(false);
    };

    const stats = [
        { label: "Liked Videos", value: "71,897" },
        { label: "Playlists", value: "58.16%" },
        { label: "Subscriptions", value: "24.57%" },
    ];

    return (
        <div>
            <div className="flex-row">
                <div className="flex space-x-5">
                    <img
                        src={user.avatar}
                        alt=""
                        className="h-56 rounded-full mb-4 border object-cover w-56"
                    />
                    <div className="items-center py-4">
                        <h1 className="text-4xl font-semibold m-2">
                            {user.fullname}
                        </h1>
                        <h2 className="text-xl text-gray-400 m-2">
                            {user.username}
                        </h2>
                        <hr />
                        <h2 className="text-lg text-gray-400 m-2">
                            Email: {user.email}
                        </h2>
                        <h2 className="text-lg text-gray-400 m-2">
                            Created at: {parseDate(user.createdAt)}
                        </h2>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md bg-gray-700 shadow-lg mt-1 px-3 py-2 text-md font-semibold text-white hover:bg-black/80"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <PencilIcon className="h-5 me-1" />
                            Edit Profile
                        </button>
                        {isEditing && (
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-gray-400">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleInputChange}
                                        className="w-full p-2 mt-1 rounded-md bg-gray-800 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 mt-1 rounded-md bg-gray-800 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400">Avatar URL</label>
                                    <input
                                        type="file"
                                        onChange={e => setFile(e.target.files[0])}
                                        className="w-full p-2 mt-1 rounded-md bg-gray-800 text-white"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded-md bg-gray-700 p-2 text-white hover:bg-black/80"
                                >
                                    Update Profile
                                </button>
                            </form>
                        )}
                    </div>
                </div>
                <div className="flex-col mt-8">
                    <div className="bg-gray-900 text-white p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Last 30 days</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
