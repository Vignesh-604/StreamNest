import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseDate } from "../utility"
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import img from "../assets/noPlaylist.jpeg"
import { useOutletContext, useNavigate } from "react-router-dom";
import Loading from '../AppComponents/Loading';

export default function Playlists({ channelId = "" }) {

    const currentUser = useOutletContext()
    const navigate = useNavigate()

    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true)

    const userId = channelId === "" ? currentUser?._id : channelId

    let [name, setName] = useState("")
    let [desc, setDesc] = useState("")

    useEffect(() => {
        axios.get(`/api/playlist/user/${userId}`)
            .then((res) => {
                setPlaylists(res.data.data)
                setLoading(false)
            })
            .catch(error => console.log(error));
    }, []);
    // console.log("Playlist:",playlists);    

    const deletePlaylist = (e, id) => {
        e.stopPropagation()
        axios.delete(`/api/playlist/${id}`)
        console.log("Deleted playlist");
        setPlaylists(playlists.filter(pst => pst._id !== id))
    }

    const newPlaylist = (e) => {
        e.preventDefault()

        if (!(name.trim())) return console.log("Enter name");

        axios.post(`/api/playlist`, { name, description: desc })
            .then(res => {
                setPlaylists([...playlists, res.data.data])
                setName("")
                setDesc("")
            })
            .catch(e => console.log(e))
    }

    if (loading) return <Loading />

    return (
        <div className="flex flex-col px-4 min-w-[36rem]">
            <h1 className="font-bold text-start text-5xl mt-7 mb-10">Playlists</h1>

            {/* Create new playlist - only if playlist belongs to current user */}
            {
                userId === currentUser._id ? (
                    <form className="flex flex-row mb-6 mx-auto shadow-2xl p-2 mt-2 border-white text-lg" onSubmit={newPlaylist}>
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
                        <button type="submit" title="Create playlist" className="inline-flex items-center pe-2 rounded-lg font-semibold hover:bg-slate-800 hover:text-green-400">
                            <PencilSquareIcon className="w-7 h-7 mx-2 rounded-lg" />Create
                        </button>
                    </form>
                ) : null
            }

            {
                playlists.length ? (
                    <div className="grid max-md:place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {
                             playlists.map(plst => (
                                <div key={plst._id}
                                    onClick={() => navigate(`/playlist/${plst._id}`)}
                                    className=" rounded-md border p-3 flex-col items-start hover:bg-slate-800 max-md:w-[420px]"
                                >
                                    <img
                                        src={plst.poster ? plst.poster?.thumbnail : img}
                                        onError={(e) => e.target.src = { img }}
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
                                            <span className="mb-2 mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-[12px] font-bold text-gray-900">
                                               Videos: {plst.videos.length}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 transition mt-4 w-full rounded-sm bg-red-700 px-2 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                            onClick={(e) => deletePlaylist(e, plst._id)}
                                        >
                                            <TrashIcon className="h-5 w-5 text-white" />
                                            Delete Playlist
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) :
                    (
                        <h1 className="flex justify-center font-bold text-start text-4xl mt-7 mb-10">No Playlists available</h1>
                    )
            }
        </div>
    );
}
