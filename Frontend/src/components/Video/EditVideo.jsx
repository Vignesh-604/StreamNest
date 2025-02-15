import axios from "axios";
import img from "../assets/thumbnail.jpg";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext, useLocation } from "react-router-dom";
import Loading from '../AppComponents/Loading';
import { showCustomAlert } from "../utility";
import { Film } from 'lucide-react';

export default function EditVideo() {
    const user = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    let location = useLocation();
    let editMode = location.pathname.includes("/video/edit");

    const [video, setVideo] = useState(null);
    const [content, setContent] = useState({
        title: "",
        description: "",
    });

    const [currContent, setCurrContent] = useState({
        title: "",
        description: "",
    });
    
    const [thumbnail, setThumbnail] = useState(null);

    const { videoId } = useParams();

    useEffect(() => {
        if (editMode) {
            axios.get(`/api/video/details/${videoId}`)
                .then((res) => {
                    const videoDetails = res.data.data;
                    console.log(videoDetails);
                    
                    if (videoDetails.owner !== user._id) navigate(-1);

                    setVideo(videoDetails);
                    setContent({
                        title: videoDetails.title,
                        description: videoDetails.description,
                    });
                    setCurrContent({
                        title: videoDetails.title,
                        description: videoDetails.description,
                    });
                    setThumbnail(videoDetails.thumbnail);
                    
                    setLoading(false);
                })
                .catch(error => console.log(error));
        }
    }, []);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        }
        setContent({...content, thumbnail: file});
    };

    const handleSaveChanges = () => {
        const formData = new FormData();

        if (content.title !== currContent.title) {
            formData.append("title", content.title);
        }
        if (content.description !== currContent.description) {
            formData.append("description", content.description);
        }
        if (content.thumbnail) formData.append("thumbnail", content.thumbnail);

        let data = Array.from(formData.keys());

        if (data) {
            axios.patch(`/api/video/v/${videoId}`, formData)
            .then((res) => {
                navigate(-1);
                setTimeout(() => {
                    showCustomAlert("Video details updated successfully!");
                }, 500);
            })
            .catch(error => console.log(error.response.data));
        }
        else navigate(-1);
    };

    if (loading) return <Loading />;

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
            {video ? (
                <div className="w-full max-w-4xl bg-white/5 p-8 rounded-2xl mx-auto">
                    <div className="flex items-center mb-8">
                        <div className="h-16 w-16 mr-4 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <Film size={32} className="text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-white">Edit Video</h2>
                            <p className="mt-2 text-base text-gray-300">
                                Update your video details
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-base font-semibold text-gray-300 mb-2">Title</label>
                                <input
                                    className="w-full rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3 text-base text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    value={content.title}
                                    onChange={(e) => setContent({ ...content, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-base font-semibold text-gray-300 ">Description</label>
                                <textarea
                                    className="w-full rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3 text-base text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                    rows="5"
                                    value={content.description}
                                    onChange={(e) => setContent({ ...content, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-base font-semibold text-gray-300 ">Thumbnail</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col space-y-6">

                            <div className="flex-grow">
                                <label className="block text-base font-semibold text-gray-300 ">Preview</label>
                                <div className="max-h-64 p-2 w-full rounded-lg border border-gray-600 bg-gray-900/50 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={thumbnail || img}
                                        alt="Thumbnail"
                                        onError={e => e.target.src = img}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Bottom Buttons */}
                            <div className="flex justify-end w-full space-x-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    type="button"
                                    className="px-6 py-2 w-full rounded-lg bg-transparent border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors hover:scale-105"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    className="px-6 py-2 w-full rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors flex items-center justify-center hover:scale-105"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
}