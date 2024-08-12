import axios from "axios";
import img from "../assets/thumbnail.jpg";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext, useLocation } from "react-router-dom";
import Loading from '../AppComponents/Loading';

export default function EditVideo() {

    const user = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

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
                    
                    // Uncomment the line below if you need to ensure the user is the owner of the video
                    if (videoDetails.owner!== user._id) navigate(-1);

                    setVideo(videoDetails);
                    setContent({
                        title: videoDetails.title,
                        description: videoDetails.description,
                    });
                    setCurrContent({
                        title: videoDetails.title,
                        description: videoDetails.description,
                    });
                    setThumbnail(videoDetails.thumbnail)
                    
                    setLoading(false)
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
        setContent({...content, thumbnail: file})
    };


    const handleSaveChanges = () => {
        const formData = new FormData()

        if (content.title !== currContent.title) {
            formData.append("title", content.title)
        }
        if (content.description !== currContent.description) {
            formData.append("description", content.description)
        }
        if (content.thumbnail) formData.append("thumbnail", content.thumbnail)

        let data = Array.from(formData.keys())                      // Converts the formData.key iterator to Array and checks if anything has been updated       

        if (data) {
            axios.patch(`/api/video/v/${videoId}`, formData)
            .then((res) => {
                navigate(-1)
                setTimeout(() => {
                    alert("Video details updated successfully!");
                }, 200);

            })
            .catch(error => console.log(error.response.data));
        }
        else navigate(-1)
    };

    if (loading) return <Loading />

    return (
        <>
            {
                video ? (
                    <div className="flex flex-col items-center p-5 pb-2 rounded-lg bg-gray-800">
                        <div className="relative">
                            <img
                                src={thumbnail || img}
                                alt="Thumbnail"
                                onError={e => e.target.src = img}
                                className="h-40 rounded-lg border border-gray-600 p-2 object-cover w-72 my-auto"
                            />
                            <label className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded-md cursor-pointer">
                                New
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleThumbnailChange}
                                />
                            </label>
                        </div>

                        <div className="items-center py-4 w-full max-w-lg lg:w-[350px] space-y-2">
                            <textarea
                                className="mb-4 w-full text-2xl p-2 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 resize-none"
                                value={content.title}
                                onChange={(e) => setContent({ ...content, title: e.target.value })}
                            />

                            <textarea
                                className="mb-4 w-full p-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 resize-none"
                                rows="7"
                                placeholder="Write your post..."
                                value={content.description}
                                onChange={(e) => setContent({ ...content, description: e.target.value })}
                            />
                            <hr className="" />

                            <div className="flex flex-col space-y-2 ">
                                <button
                                    className="bg-gray-950 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600"
                                    onClick={handleSaveChanges}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <h1>Loading...</h1>
                )
            }
        </>
    );
}
