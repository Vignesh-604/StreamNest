import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import img from "../assets/noPlaylist.jpeg";
import VideoItem from "../Video/VideoItem";
import Loading from '../AppComponents/Loading';
import { parseDate, parseTime, showCustomAlert, showConfirmAlert } from "../Utils/utility";

export default function Playlist() {
    const currentUser = useOutletContext();
    const { channelId, id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [playlist, setPlaylist] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    let owner = (currentUser?._id === channelId) || (channelId == undefined)

    useEffect(() => {
        axios.get(`/api/playlist/${id}`)
            .then(res => {
                const plst = res.data.data;
                setPlaylist(plst);
                setNewTitle(plst.name);
                setNewDescription(plst.description);
                setLoading(false);
            })
            .catch(error => error.response.status == 404 ? navigate(-1) : console.log(error));
    }, []);

    const removeVideo = (vidId) => {
        showConfirmAlert(
            "Remove Video?",
            "Are you sure you want to remove this video from the playlist?",
            () => {
                axios.delete(`/api/playlist/video/${vidId}/${id}`)
                    .then(res => {
                        setPlaylist({ 
                            ...playlist, 
                            videos: playlist.videos.filter(vid => vid?._id !== vidId) 
                        });
                        showCustomAlert("Removed!", "Video has been successfully removed from the playlist.");
                    })
                    .catch(e => console.log(e.response.data));
            }
        );
    };   

    const deletePlaylist = () => {
        showConfirmAlert(
            "Delete Playlist?",
            "Are you sure you want to delete this playlist? This action cannot be undone.",
            () => {
                axios.delete(`/api/playlist/${playlist?._id}`)
                    .then(() => {
                        showCustomAlert("Deleted!", "Playlist has been successfully deleted.");
                        navigate(-1);
                    })
                    .catch(e => console.log(e));
            }
        );
    };

    const saveChanges = () => {
        axios.post(`/api/playlist/${playlist?._id}`, { name: newTitle, description: newDescription })
            .then(res => {
                setPlaylist({ ...playlist, title: res.data.data.name, description: res.data.data.description });
                setEditMode(false);
            })
            .catch(e => console.log(e.response.data));
    };

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col items-center bg-[#0a0a26]/40 text-white px- py- max-h-screen">
            <div className="bg-transparent rounded-lg p-8 mb-8 w-full ">
                {playlist ? (
                    <div className="flex flex-col lg:flex-row max-md:w-full md:space-x-8 h-[calc(100vh-100px)]">
                        <div className="flex flex-col items-center p-5 rounded-lg bg-gray-900 border border-purple-500/20 shadow-md lg:w-[420px] lg:sticky top-20 h-full">
                            {/* Top Section: Image, Title, Description */}
                            <div className="flex flex-col items-center w-full">
                                <img
                                    src={playlist.videos[0] ? playlist.videos[0]?.thumbnail : img}
                                    alt="Playlist thumbnail"
                                    onError={(e) => (e.target.src = img)}
                                    className="h-56 rounded-lg border border-purple-500/30 object-cover w-full my-auto"
                                />
                                <div className="items-center py-4 w-full max-w-lg lg:w-full">
                                    {editMode ? (
                                        <>
                                            <input
                                                type="text"
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                                className="w-full text-2xl font-semibold my-2 p-2 bg-gray-800 text-white rounded-lg border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                            />
                                            <textarea
                                                value={newDescription}
                                                rows={4}
                                                onChange={(e) => setNewDescription(e.target.value)}
                                                className="w-full text-xl my-2 p-2 bg-gray-800 text-white rounded-lg line-clamp-3 resize-none border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                            />
                                        </>
                                    ) : (
                                        <div className="text-start m-2">
                                            <h1 className="text-3xl font-bold text-purple-100">
                                                {playlist.name}
                                            </h1>
                                            <h2 className="text-lg text-gray-400 line-clamp-6">
                                                {playlist.description}
                                            </h2>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Spacer to push bottom section down */}
                            <div className="flex-grow"></div>

                            <div className="w-full">
                                <hr className="border-purple-500/20 my-4" />
                                <h2 className="text-lg text-gray-400/70 m-2">
                                    Last updated at: {parseDate(playlist.updatedAt)}
                                </h2>
                                <h2 className="text-lg text-gray-400/70 m-2">
                                    Videos: {playlist.videos.length}
                                </h2>

                                {owner && (
                                    editMode ? (
                                        <div className="flex flex-row space-x-4 mt-4">
                                            <button
                                                onClick={() => setEditMode(false)}
                                                className="bg-gray-800 w-full hover:bg-purple-500/10 text-gray-400 hover:text-purple-300 font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-purple-500/20"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={saveChanges}
                                                className="bg-purple-500/10 w-full hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-purple-500/20"
                                            >
                                                Save changes
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-row space-x-4 mt-4 text-white">
                                            <button
                                                onClick={() => setEditMode(true)}
                                                className=" w-full bg-[#7c3aed] hover:bg-[#6d28d9]/80 cursor-pointer hover:scale-95 font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-purple-500/20"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={deletePlaylist}
                                                className="bg-red-500 w-full hover:bg-red-500/60 cursor-pointer hover:scale-95 font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-red-500/20"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>


                        <div className="w-full h-full space-y-6 px-8 overflow-y-auto max-h-[calc(100vh-100px)]">
                            {playlist.videos.length ? (
                                playlist.videos.map(vid => (
                                    <div className="flex justify-between card" key={vid?._id}>
                                        <VideoItem
                                            id={vid?._id}
                                            title={vid.title}
                                            description={vid.description}
                                            owner={vid.owner}
                                            views={vid.views}
                                            thumbnail={vid.thumbnail}
                                            duration={parseTime(vid.duration)}
                                        />
                                        {
                                            owner && (
                                                <div className="flex items-start mt-6">
                                                    <button
                                                        onClick={() => removeVideo(vid?._id)}
                                                        className="flex justify-center md:items-center transform hover:scale-120"
                                                        title="Remove video"
                                                    >
                                                        <X className="m-2 h-7 w-7 text-white hover:bg-gray-500/20 hover:bg-opacity-15 rounded-xl" />
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>
                                ))
                            ) : null}
                        </div>
                    </div>

                ) : (
                    <h1 className="text-xl font-semibold text-purple-100">Loading</h1>
                )}
            </div>
        </div>
    );
}
