import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { ArrowRight, Film } from 'lucide-react';
import { showCustomAlert } from "../utility";

export default function NewVideo() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false)

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = (e) => {
        e.preventDefault()
        setUploading(true)

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (thumbnail) formData.append('thumbnail', thumbnail);
        if (videoFile) formData.append('videoFile', videoFile);

        axios.post('/api/video/new', formData)
            .then((res) => {
                setTimeout(() => {
                    showCustomAlert('Video uploaded')
                }, 500)
                navigate(-1);
            })
            .catch(error => {
                console.log(error.response.data)
                setUploading(false)
            });
    };

    if (uploading) return (
        <div className="flex flex-col items-center mt-5 space-y-4">
            <ReactLoading type={'spinningBubbles'} height={80} width={80} />
            <h1 className='text-2xl text-white'>Uploading Video...</h1>
        </div>
    )

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
            <div className="w-full max-w-4xl bg-white/5 p-8 rounded-2xl mx-auto">
                <div className="flex items-center mb-8">
                    <div className="h-16 w-16 mr-4 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Film size={32} className="text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-white">Upload New Video</h2>
                        <p className="mt-2 text-base text-gray-300">
                            Share your amazing content with the world
                        </p>
                    </div>
                </div>

                <form onSubmit={handleUpload}>
                    <div className="grid grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-base font-semibold text-gray-300 mb-2">Title</label>
                                <input
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3 text-base text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="Enter video title"
                                />
                            </div>

                            <div>
                                <label className="block text-base font-semibold text-gray-300 mb-2">Description</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3 text-base text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                    rows="4"
                                    placeholder="Enter video description"
                                />
                            </div>

                            <div>
                                <label className="block text-base font-semibold text-gray-300 mb-2">Video File</label>
                                <input
                                    required
                                    type="file"
                                    accept="video/*"
                                    onChange={e => setVideoFile(e.target.files[0])}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col space-y-6">
                            <div>
                                <label className="block text-base font-semibold text-gray-300 mb-2">Thumbnail</label>
                                <input
                                    required
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>

                            <div className="flex-grow">
                                <label className="block text-base font-semibold text-gray-300 mb-2">Preview</label>
                                <div className="h-40 w-full rounded-lg border border-gray-600 bg-gray-900/50 flex items-center justify-center overflow-hidden">
                                    {thumbnailPreview ? (
                                        <img src={thumbnailPreview} alt="Thumbnail preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400 text-sm">No image</span>
                                    )}
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
                                    type="submit"
                                    className="px-6 py-2 w-full rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors flex items-center justify-center hover:scale-105"
                                >
                                    Upload <ArrowRight className="ml-2" size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}