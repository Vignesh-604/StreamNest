import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
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
            <ReactLoading type={'spinningBubbles'} height={120} width={120} />
            <h1 className='text-3xl'>Uploading Video...</h1>
        </div>
    )

    return (
        <form className="flex flex-col max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg" onSubmit={handleUpload}>
            <h1 className="text-3xl font-semibold text-white">Upload New Video</h1>
            <hr className='my-4' />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Title and Description */}
                <div className="flex flex-col space-y-4">
                    <div>
                        <label className="text-lg font-semibold text-white">Title</label>
                        <textarea
                            required
                            rows={2}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white resize-none"
                            placeholder="Enter video title"
                        />
                    </div>
                    <div>
                        <label className="text-lg font-semibold text-white">Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white resize-none"
                            rows="6"
                            placeholder="Enter video description"
                        />
                    </div>
                </div>

                {/* Column 2: Thumbnail and Video Upload */}
                <div className="flex flex-col space-y-4">
                    <div>
                        <h1 className="text-lg font-semibold text-white">Thumbnail</h1>
                        <input
                            required
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                        />
                        {thumbnailPreview && (
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                className="mt-4 rounded-lg max-h-40 w-full object-cover"
                            />
                        )}
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-white">Video File</h1>
                        <input
                            required
                            type="file"
                            accept="video/*"
                            onChange={e => setVideoFile(e.target.files[0])}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Upload and Cancel Buttons */}
            <div className="flex space-x-4 mt-6 justify-end">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Cancel
                </button>
                <button type='submit'
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Upload Video
                </button>
            </div>
        </form>
    );
}
