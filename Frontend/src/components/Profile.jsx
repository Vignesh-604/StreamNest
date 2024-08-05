import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { parseDate } from "./utility";
import axios from "axios";
import { PencilLine, PencilOff, Save } from "lucide-react";

export default function Profile() {
    // const [user, setUser] = useState(JSON.parse(Cookies.get("user")));   // FOR TESTING
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({})
    const [avatarFile, setAvatarFile] = useState("")
    const [covImgFile, setCovImgFile] = useState("")

    useEffect(() => {
        axios.get("/api/users/current_user")
            .then(res => {
                // console.log("User data:",res.data.data);
                setUser(res.data.data)
                setFormData({...formData,
                    fullname: res.data.data.fullname,
                    email: res.data.data.email,
                }
                )
            })
            .catch(e => console.log(e))
    }, [])
    // console.log(user);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Check if any changes made to fullname or email
        if (formData.fullname !== user.fullname || formData.email !== user.email) {

            axios.patch("/api/users/update_details", {
                fullname: formData.fullname,
                email: formData.email
            })
                .then(res => setUser(user => ({
                    ...user, 
                    email: res.data.data.email,
                    fullname: res.data.data.fullname,
                })))
                .catch(e => console.log(e))
        }

        // Change password
        if (formData.oldPassword && formData.newPassword) {
            axios.patch("/api/users/change_password", {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            })
                .then(res => console.log("Password changed: ",res))
                .catch(e => console.log(e))
        }

        // Check and update avatar
        if (avatarFile) {
            const form = new FormData()
            form.append("avatar", avatarFile)

            axios.patchForm("/api/users/update_avatar", {
                "avatar": avatarFile
            })
                .then(res => setUser(user => ({...user, avatar: res.data.data.avatar})))
                .catch(e => console.log(e))
        }

        // Check and update cover img
        if (covImgFile) {
            const form = new FormData()
            form.append("covImg", covImgFile)

            axios.patchForm("/api/users/update_cover_image", {
                "coverImage": covImgFile
            })
                .then(res => setUser(user => ({...user, coverImage: res.data.data.coverImage})))
                .catch(e => console.log(e))
        }

        // clear passwords fields
        setFormData({...formData,
            oldPassword: "",
            newPassword: "",
        })

        // close the form
        setIsEditing(false);
    };

    const stats = [
        { label: "Liked Videos", value: user.likedVidCount },
        { label: "Playlists", value: user.playlists },
        { label: "Subscriptions", value: user.subscriptions },
    ];

    return (
        <div>
            <div className="flex-row">
                <div className="flex space-x-5 px-5 lg:w-[800px]">
                    <img
                        src={user.avatar}
                        alt=""
                        className="h-56 rounded-full mb-4 border object-cover w-56"
                    />
                    <div className="items-center py-4 w-full">
                        <h1 className="text-4xl font-semibold m-2">
                            {user.fullname}
                        </h1>
                        <h2 className="text-xl text-gray-400 m-2">
                            {user.username}
                        </h2>
                        <hr className="ms-2 md:me-10" />
                        <h2 className="text-lg text-gray-400 m-2">
                            Email: {user.email}
                        </h2>
                        <h2 className="text-lg text-gray-400 m-2">
                            Created at: {parseDate(user.createdAt)}
                        </h2>

                        <div className="flex flex-row space-x-2">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md bg-gray-700 shadow-lg mt-1 px-3 py-2 text-md font-semibold text-white hover:bg-black/80"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? (
                                     <>
                                     <PencilOff className="h-5 me-1" />
                                     Cancel
                                 </>
                                ) : (
                                    <>
                                        <PencilLine className="h-5 me-1" />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                            {
                                isEditing ? (
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md bg-gray-700 shadow-lg mt-1 px-3 py-2 text-md font-semibold text-white hover:bg-black/80"
                                        onClick={handleSubmit}
                                    >
                                        <Save className="h-5 me-1" />
                                        Save
                                    </button>
                                ) : null
                            }

                        </div>


                    </div>
                </div>
                <div className="flex px-9 lg:w-[800px] justify-center">
                    {isEditing && (
                        <form onSubmit={handleSubmit} className="my-4 flex flex-col max-md: md:space-x-4 md:flex-row shadow-inner shadow-slate-800 rounded-md p-4">
                            <div className="flex-col">
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
                                        onChange={e => setAvatarFile(e.target.files[0])}
                                        className="w-full p-2 mt-1 rounded-md bg-gray-800 text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex-col">
                                <div>
                                    <label className="block text-gray-400">Old Password</label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={formData.oldPassword}
                                        onChange={handleInputChange}
                                        className="w-full p-2 mt-1 rounded-md bg-gray-800 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        className="w-full p-2 mt-1 rounded-md bg-gray-800 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400">Avatar URL</label>
                                    <input
                                        type="file"
                                        onChange={e => setCovImgFile(e.target.files[0])}
                                        className="w-full p-2 mt-1 rounded-md bg-gray-800 text-white"
                                    />
                                </div>
                            </div>
                        </form>
                    )}
                </div>
                <div className="flex-col mt-4 lg:w-[800px]">
                    <div className="bg-gray-900 text-white p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Your details</h2>
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
