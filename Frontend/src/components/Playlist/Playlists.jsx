import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseDate } from "../utility";
import { TrashIcon, X, Plus } from "lucide-react";
import img from "../assets/noPlaylist.jpeg";
import { useOutletContext, useNavigate } from "react-router-dom";
import Loading from '../AppComponents/Loading';
import { showCustomAlert, showConfirmAlert } from "../utility";

export default function Playlists({ channelId = "" }) {
    const currentUser = useOutletContext();
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const userId = channelId === "" ? currentUser?._id : channelId;
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    useEffect(() => {
        axios.get(`/api/playlist/user/${userId}`)
            .then((res) => {
                setPlaylists(res.data.data);
                setLoading(false);
            })
            .catch(error => console.log(error));
    }, []);

    const deletePlaylist = (e, id) => {
        e.stopPropagation();
        
        showConfirmAlert(
            "Delete Playlist?",
            "Are you sure you want to delete this playlist? This action cannot be undone.",
            () => {
                axios.delete(`/api/playlist/${id}`)
                    .then(() => {
                        showCustomAlert("Deleted!", "Playlist has been successfully deleted.");
                        setPlaylists(playlists.filter(pst => pst._id !== id));
                    })
                    .catch(e => console.log(e));
            }
        );
    };

    const newPlaylist = (e) => {
        e.preventDefault();
        if (!(name.trim())) return;

        axios.post(`/api/playlist`, { name, description: desc })
            .then(res => {
                setPlaylists([...playlists, res.data.data]);
                setName("");
                setDesc("");
                setShowModal(false);
                showCustomAlert("Success!", "New playlist created successfully.");
            })
            .catch(e => console.log(e));
    };

    const CreatePlaylistModal = () => (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#1e2030] rounded-lg border border-gray-950/45 shadow-2xl shadow-black w-full max-w-md m-4 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Create New Playlist</h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={newPlaylist} className="space-y-4">
                    <div>
                        <label className="text-gray-400 text-sm">Playlist Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-[#2a2b3e] text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#8A3FFC]"
                            placeholder="Enter playlist name"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Description</label>
                        <input
                            type="text"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-[#2a2b3e] text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#8A3FFC]"
                            placeholder="Enter description"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#8A3FFC] hover:bg-[#7B37E5] px-4 py-2 rounded-lg transition-all duration-200"
                    >
                        Create Playlist
                    </button>
                </form>
            </div>
        </div>
    );

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col items-center bg-[#0a0a26]/40 text-white px-6 py-8 min-h-screen">
            <div className="bg-[#24273a] rounded-lg p-8 mb-8 w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="font-extrabold text-4xl">Playlists</h1>
                    {userId === currentUser._id && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-[#8A3FFC] hover:bg-[#7B37E5] px-4 py-2 rounded-lg transition-all duration-200"
                        >
                            <Plus className="w-5 h-5" />
                            New Playlist
                        </button>
                    )}
                </div>

                {playlists.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {playlists.map(plst => (
                            <div 
                                key={plst._id}
                                onClick={() => navigate(`/playlist/${plst._id}`)}
                                className=" flex flex-col rounded-lg hover:bg-gray-950/65 bg-gray-900/60 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                            >
                                <img
                                    src={plst.poster ? plst.poster?.thumbnail : img}
                                    onError={(e) => e.target.src = img}
                                    className="h-[200px] w-full object-cover rounded-lg border border-gray-950/50"
                                />
                                <div className="p-4 flex-1 flex flex-col">
                                    <h1 className="text-lg font-semibold text-white">
                                        {plst.name}
                                    </h1>
                                    <p className="mt-2 text-gray-400 line-clamp-2 flex-1">
                                        {plst.description}
                                    </p>
                                    <div className="mt-4">
                                        <span className="mb-2 mr-2 inline-block rounded-full bg-[#252832] px-3 py-1 text-[12px] font-semibold text-gray-300">
                                            Last updated: {parseDate(plst.updatedAt)}
                                        </span>
                                        <span className="mb-2 inline-block rounded-full bg-[#252832] px-3 py-1 text-[12px] font-semibold text-gray-300">
                                            Videos: {plst.videos.length}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="mt-4 cursor-pointer flex items-center justify-center gap-2 w-full rounded-lg bg-[#8A3FFC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7B37E5] transition-all duration-200 hover:scale-105"
                                        onClick={(e) => deletePlaylist(e, plst._id)}
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                        Delete Playlist
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h1 className="text-center font-bold text-3xl mt-7">No Playlists available</h1>
                )}
            </div>

            {showModal && <CreatePlaylistModal />}
        </div>
    );
}