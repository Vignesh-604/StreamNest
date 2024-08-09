import axios from "axios";
import img from "../assets/noPlaylist.jpeg"
import { useEffect, useState } from "react";
import { parseDate, parseTime } from "../utility";
import VideoItem from "../Video/VideoItem";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Loading from "../Loading";

export default function Playlist() {

    const currentUser = useOutletContext();
    const [owner, setOwner] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [playlist, setPlaylist] = useState(null);

    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    useEffect(() => {
        axios.get(`/api/playlist/${id}`)
            .then(res => {
                const plst = res.data.data;
                setPlaylist(plst);
                setOwner(plst.owner.username === currentUser.username);
                setNewTitle(plst.name);
                setNewDescription(plst.description);
                setLoading(false);
            })
            .catch(error => error.response.status == 404 ? navigate(-1) : console.log(error));
    }, []);

    const removeVideo = (plstId, vidId) => {
        axios.delete(`/api/playlist/video/${plstId}/${vidId}`)
            .then(res => console.log(res))
            .catch(e => console.log(e));
    };

    const deletePlaylist = () => {
        axios.delete(`/api/playlist/${playlist._id}`)
        navigate(-1)
        setTimeout(() => {
            alert("Playlist deleted");
        }, 200);
    };

    const saveChanges = () => {
        axios.post(`/api/playlist/${playlist._id}`, { name: newTitle, description: newDescription })
            .then(res => {
                setPlaylist({...playlist, title: res.data.data.title, description: res.data.data.description});
                setEditMode(false);
            })
            .catch(e => console.log(e));
    };

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col xl:flex-row place-items-center pb-12">
            {
                playlist ? (
                    <div className="flex flex-col md:flex-row max-md:w-full md:space-x-4">
                        <div className="flex flex-col items-center p-5 rounded-lg bg-gray-800">
                            <img
                                src={playlist.videos[0] ? playlist.videos[0]?.thumbnail : img}
                                alt="Playlist thumbnail"
                                onError={e => e.target.src = img}
                                className="h-56 rounded-lg  border object-cover w-full my-auto"
                            />

                            <div className="items-center py-4 w-full max-w-lg lg:w-[350px]">
                                {
                                    editMode ? (
                                        <>
                                            <input
                                                type="text"
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                                className="w-full text-2xl font-semibold my-2 p-2 bg-gray-900 text-white rounded-lg"
                                            />
                                            <textarea
                                                value={newDescription}
                                                rows={4}
                                                onChange={(e) => setNewDescription(e.target.value)}
                                                className="w-full text-xl my-2 p-2 bg-gray-900 text-white rounded-lg line-clamp-3"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <h1 className="text-4xl font-semibold m-2">
                                                {playlist.name}
                                            </h1>
                                            <h2 className="text-xl text-gray-400 m-2 line-clamp-3">
                                                {playlist.description}
                                            </h2>
                                        </>
                                    )
                                }
                                <hr className="" />
                                <h2 className="text-lg text-gray-400 m-2">
                                    Playlist updated at: {parseDate(playlist.updatedAt)}
                                </h2>

                                <div className="flex flex-col space-y-2 ">
                                    <div className="flex flex-wrap w-full space-x-2 font-semibold border rounded-lg p-2 bg-slate-300 text-black">
                                        <img
                                            src={playlist.owner.avatar}
                                            onError={e => e.target.src = img}
                                            className="h-7 rounded" />
                                        <span className="font-bold">{playlist.owner.fullname}</span>
                                        <span>@{playlist.owner.username}</span>
                                    </div>
                                </div>

                                {
                                    owner ? (
                                        editMode ? (
                                            <div className="flex flex-row space-x-4 mt-2">
                                                <button
                                                    onClick={() => setEditMode(false)}
                                                    className="bg-gray-950 w-full hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    onClick={saveChanges}
                                                    className="bg-green-600 w-full hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                                >
                                                    Save changes
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-row space-x-4 mt-2">
                                                <button onClick={() => setEditMode(true)}
                                                    className="bg-gray-950 w-full hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                                >
                                                    Edit
                                                </button>

                                                <button onClick={deletePlaylist}
                                                    className="bg-red-600 w-full hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )
                                    ) : null
                                }

                            </div>
                        </div>
                        <div className="">
                            {
                                playlist.videos.length ? (
                                    playlist.videos.map(vid => (
                                        <div key={vid._id} className="">
                                            <VideoItem key={vid._id}
                                                id={vid._id}
                                                title={vid.title}
                                                description={vid.description}
                                                owner={vid.owner.username}
                                                views={vid.views}
                                                thumbnail={vid.thumbnail}
                                                duration={parseTime(vid.duration)}
                                                toggleLike={() => removeVideo(playlist._id, vid._id)}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    null
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <h1>Loading</h1>
                )
            }
        </div>
    )
}
