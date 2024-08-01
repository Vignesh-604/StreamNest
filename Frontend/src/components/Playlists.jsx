import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { parseDate } from "./utility";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import defaultImg from "../assets/thumbnail.jpeg"

export default function Playlists({ user = "" }) {
    const [playlists, setPlaylists] = useState([]);
    const myId = (JSON.parse(Cookies.get("user")))._id

    const userId = user === "" ? (myId) : user

    let [name, setName] = useState("")
    let [desc, setDesc] = useState("")

    useEffect(() => {
        axios.get(`/api/playlist/user/${userId}`)
            .then((res) => setPlaylists(res.data.data))
            .catch(error => console.log(error));
    }, []);

    const deletePlaylist = (id) => {
        axios.delete(`/api/playlist/${id}`)
        console.log("Deleted playlist");
        setPlaylists(playlists.filter(pst => pst._id !== id))
    }

    const newPlaylist = () => {
        if (!(name.trim())) return console.log("Enter name");

        axios.post(`api/playlist`, { name, description: desc })
            .then(res => {
                setPlaylists(plst => plst.push(res))
            })
            .catch(e => console.log(e))

    }

    return (
        <div className="flex flex-col  px-4 min-w-[36rem]">
            <h1 className="font-bold text-start text-5xl mt-7 mb-4">
            {userId == myId ? ("Your Playlists") : ("Channel Playlists")}
            </h1>

            {
                userId === myId ? (
                    <form className="flex flex-row my-6 border-white text-lg" onSubmit={() => newPlaylist()}>
                        <h1 className=" my-auto me-4 font-semibold">
                            Create new playlist:
                        </h1>
                        <input
                            className="flex mx-1 h-10 lg:w-[250px] rounded-md border border-black/30 bg-transparent p-1 text-lg placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                            type="text" required
                            placeholder="Playlist name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            className="flex mx-1 h-10 lg:w-[450px] rounded-md border border-black/30 bg-transparent px-1 py-1 text-lg placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                            type="text" required
                            placeholder="Description"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                        <button type="submit" title="Create playlist">
                            <PencilSquareIcon className="w-10 h-10 mx-2 rounded-lg hover:text-green-400" />
                        </button>
                    </form>
                ) : null
            }

            <div className="grid max-md:place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {
                    playlists.length ?
                        playlists.map(plst => (
                            <div key={plst._id} className=" rounded-md border p-3 flex-col items-start hover:bg-slate-800 max-md:w-[420px]" >
                                <img
                                    src={plst.poster ? plst.poster?.thumbnail : defaultImg}
                                    onError={(e) => e.target.src = { defaultImg }}
                                    className="h-[200px] w-full rounded-t-md object-cover"
                                />
                                <div className="p-4">
                                    <h1 className="inline-flex items-center text-lg font-semibold">
                                        {plst.name}
                                    </h1>
                                    <p className="mt-2 text-gray-400 line-clamp-2">
                                        {plst.description}
                                    </p>
                                    <div className="mt-4">
                                        <span className="mb-2 mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-[12px] font-bold text-gray-900">
                                            Last updated at: {parseDate(plst.updatedAt)}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 transition mt-4 w-full rounded-sm bg-red-700 px-2 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                        onClick={() => deletePlaylist(plst._id)}
                                    >
                                        <TrashIcon className="h-5 w-5 text-white" />
                                        Delete Playlist
                                    </button>
                                </div>
                            </div>
                        )) :
                        (
                            <h1 className="font-bold text-start text-5xl mt-7 mb-10">No Playlists available</h1>
                        )
                }
            </div>
        </div>
    );
}
