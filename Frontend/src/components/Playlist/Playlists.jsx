import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseDate, showCustomAlert, showConfirmAlert } from "../Utils/utility";
import { TrashIcon, X, Plus, BadgeDollarSign } from "lucide-react";
import img from "../assets/noPlaylist.jpeg";
import { useOutletContext, useNavigate, useParams, useLocation } from "react-router-dom";
import Loading from '../AppComponents/Loading';
import Toggle from 'react-toggle'
import "react-toggle/style.css";

export default function Playlists() {
    let currentUser = useOutletContext();
    const navigate = useNavigate();

    let { channelId } = useParams()
    let owner = (currentUser._id === channelId) || (channelId == undefined)

    const { state } = useLocation()
    currentUser = state !== null ? state : currentUser

    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const userId = !channelId ? currentUser?._id : channelId;
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [isExclusive, setIsExclusive] = useState(false)
    const [price, setPrice] = useState(30)

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

        let formData = { name, description: desc }
        if (isExclusive) formData['isExclusive'] = isExclusive
        if (price >= 20) formData['price'] = price

        axios.post(`/api/playlist`, formData)
            .then(res => {
                setPlaylists([...playlists, res.data.data]);
                setName("");
                setDesc("");
                setShowModal(false);
                showCustomAlert("Success!", "New playlist created successfully.");
            })
            .catch(e => console.log(e));
    };

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col items-center bg-[#0a0a26]/40 text-white px-6 py-8 min-h-screen">
            <div className="bg-[#24273a] rounded-lg p-8 mb-8 w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="font-extrabold text-4xl">{owner ? "Your " : `${currentUser.fullname}'s `}Playlists</h1>
                    {
                        owner && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 cursor-pointer bg-[#8A3FFC] hover:bg-[#7B37E5] px-4 py-2 rounded-lg transition-all duration-200 hover:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                                New Playlist
                            </button>
                        )
                    }
                </div>

                {playlists.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {playlists.map(plst => (
                            <div
                                key={plst._id}
                                onClick={() => navigate(`p/${plst._id}`)}
                                className="flex flex-col card group"
                            >
                                {/* Make this container relative to position absolute elements inside it */}
                                <div className="relative">
                                    <img
                                        src={plst.poster ? plst.poster?.thumbnail : img}
                                        onError={(e) => e.target.src = img}
                                        className="h-[200px] w-full object-cover rounded-lg group-hover:scale-90 transition duration-200"
                                    />
                                    {
                                        plst.isExclusive && (
                                            <div className="absolute top-2 left-2 p-1 rounded-lg bg-black bg-opacity-50">
                                                <BadgeDollarSign className="w-5 h-5 text-green-400 drop-shadow-lg stroke-2" />
                                            </div>
                                        )
                                    }
                                </div>
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
                                    {
                                        owner && (
                                            <button
                                                type="button"
                                                className="mt-4 cursor-pointer flex items-center justify-center gap-2 w-full rounded-lg bg-[#8A3FFC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7B37E5] transition-all duration-200 hover:scale-105"
                                                onClick={(e) => deletePlaylist(e, plst._id)}
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                                Delete Playlist
                                            </button>
                                        )
                                    }
                                </div>
                            </div>

                        ))}
                    </div>
                ) : (
                    <h1 className="text-center font-bold text-3xl mt-7">No Playlists available</h1>
                )}
            </div>

            {showModal &&
                <CreatePlaylistModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    name={name}
                    setName={setName}
                    desc={desc}
                    setDesc={setDesc}
                    isExclusive={isExclusive}
                    setIsExclusive={setIsExclusive}
                    price={price}
                    setPrice={setPrice}
                    newPlaylist={newPlaylist}
                />
            }
        </div>
    );
}

const CreatePlaylistModal = ({ showModal, setShowModal, name, setName, desc, setDesc, isExclusive, setIsExclusive, price, setPrice, newPlaylist }) => {
    if (!showModal) return null;

    return (
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

                    <div className='flex flex-row gap-4 justify-between'>
                        <div>
                            <label className="block text-base font-semibold text-gray-300 mb-2">Exclusive playlist</label>
                            <div className="flex items-center space-x-4">
                                <Toggle
                                    checked={isExclusive}
                                    onChange={(e) => setIsExclusive(e.target.checked)}
                                    icons={false}
                                    className='my-3'
                                />
                            </div>
                        </div>

                        {isExclusive && (
                            <div>
                                <label className="block text-base font-semibold text-gray-300 mb-2">Playlist Price</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="flex-1 rounded-lg font-bold border border-gray-600 bg-gray-900/50 px-4 py-2 text-base text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="Enter price"
                                    min="20"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#8A3FFC] hover:bg-[#7B37E5] px-4 py-2 rounded-lg transition-all duration-200 hover:scale-95 cursor-pointer"
                    >
                        Create Playlist
                    </button>
                </form>
            </div>
        </div>
    );
};
