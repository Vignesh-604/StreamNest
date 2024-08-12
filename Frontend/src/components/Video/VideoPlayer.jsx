import axios from "axios";
import profile from "../assets/profile.webp";
import img from "../assets/thumbnail.jpg";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import Loading from '../AppComponents/Loading';
import { parseDate } from '../utility';
import { CalendarArrowDown, Eye, List, ThumbsUp } from 'lucide-react';
import Comment from '../Post/Comment';
import { XMarkIcon } from "@heroicons/react/16/solid";

function VideoPage() {
    const currentUser = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [playlists, setPlaylists] = useState([]); // State to store playlists

    // Load Video and comments
    useEffect(() => {
        axios.get(`/api/video/v/${videoId}`)
            .then((res) => {
                const videoDetails = res.data.data[0]
                setVideo(videoDetails);
                setLoading(false)
            })
            .catch(error => console.log(error.response.data));

        axios.get(`/api/comment/video/${videoId}`)
            .then((res) => setComments(res.data.data.docs))
            .catch(error => console.log(error.response.data));

        axios.post(`/api/watchHistory/track/${videoId}`)
            .catch(error => console.log(error.response.data));

    }, [videoId])

    // Subscribe/ unsubscribe
    const toggleSub = () => {
        axios.post(`/api/subscription/channel/${video.owner._id}`)
            .then(res => {
                setVideo({
                    ...video,
                    isSubscribed: !video.isSubscribed,
                    subscribers: res.data.data == null ? --video.subscribers : ++video.subscribers
                })
            })
            .catch(e => console.log(e.response.data))
    }

    // Like / unlike video
    const toggleVideoLike = () => {
        axios.post(`/api/like/v/${videoId}`)
            .then((res) => setVideo(
                video => ({
                    ...video,
                    isLiked: !video.isLiked,
                    likes: video.isLiked ? video.likes - 1 : video.likes + 1
                })
            ))
            .catch(error => console.log(error));
    }

    // Add comment
    const addComment = () => {
        if (content && content.trim()) {

            axios.post(`/api/comment/video/${videoId}`, { content })
                .then((res) => {
                    setComments([...comments, {
                        ...res.data.data,
                        likes: 0,
                        owner: {
                            username: currentUser.username,
                            fullname: currentUser.fullname,
                            avatar: currentUser.avatar,
                        }
                    }])
                    setContent("")
                })
                .catch(error => console.log(error))
        }
    }

    // Delete comment
    const deleteComment = (id) => {
        axios.delete(`/api/comment/c/${id}`)
            .then((res) => setComments(comments => comments.filter(com => com._id !== id)))
            .catch(error => console.log(error))
    }

    // Toggle comment like
    const toggleCommentLike = (commentId) => {
        axios.post(`/api/like/c/${commentId}`)
            .then((res) => setComments(
                comments => comments.map(comment =>
                    comment._id === commentId ? {
                        ...comment,
                        isLiked: !comment.isLiked,
                        likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
                    } : comment
                )
            ))
            .catch(error => console.log(error));
    };

    // Toggle modal visibility
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        if (!isModalOpen) {
            // Fetch playlists only when opening the modal
            axios.get(`/api/playlist/user/${currentUser._id}`)
                .then((res) => setPlaylists(res.data.data))
                .catch(error => console.log(error.response.data));
        }
    }


    // Add video to selected playlist
    const addToPlaylist = (playlistId) => {
        axios.post(`/api/playlist/video/${videoId}/${playlistId}`,)
            .then(res => {
                console.log('Video added to playlist');
                setIsModalOpen(false);  // Close the modal after adding
            })
            .catch(error => console.log(error.response.data));
    };

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col mx-14 max-w-screen-2xl">
            <div className=" text-white flex flex-col xl:flex-row max-xl:items-start">
                {/* Video Player Section */}
                <div className="w-[70%] max-h-[580px] max-xl:w-full flex mt-5 justify-center items-center rounded-lg bg-black">
                    <video
                        className="w-[1400px] h-auto max-h-full object-contain rounded-lg"
                        controls
                        controlsList="nodownload"
                        poster={video.thumbnail ? video.thumbnail : img}
                        autoPlay muted
                        onError={e => e.target.poster = img}
                    >
                        <source src={video.videoFile} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Video Details Section */}
                <div className="xl:w-[30%] w-full p-4 flex flex-col">
                    <div>
                        <h1 className="text-2xl font-semibold mb-4 lg:line-clamp-3">
                            {video.title}
                        </h1>

                        <div className='flex flex-row justify-between max-[500px]:flex-col'>
                            <div
                                className="flex items-center text-sm text-gray-400 mb-4 cursor-pointer"
                                title={video.owner.fullname}
                                onClick={() => navigate(video.owner._id !== currentUser._id ? `/channel/${video.owner._id}` : "/channel")}
                            >
                                <img
                                    src={video.owner.avatar ? video.owner.avatar : profile}
                                    alt="Channel Logo"
                                    className="h-12 w-12 object-cover rounded-full mr-4"
                                />
                                <div>
                                    <p className="text-white">{video.owner.fullname}</p>
                                    <p>{video.subscribers} subscribers</p>
                                </div>
                            </div>
                            <div onClick={toggleSub} className='mr-3'>
                                {
                                    video.isSubscribed ? (
                                        <button className="subscribe-button border bg-red-700 rounded-lg text-xl px-3 py-1.5">
                                            Subscribed
                                        </button>
                                    ) : (
                                        <button className="subscribe-button border w-full bg-gray-700 rounded-lg text-xl px-3 py-1.5">
                                            Subscribe
                                        </button>
                                    )
                                }
                            </div>
                        </div>

                        <div className='flex flex-row items-center gap-x-8  w-full text-gray-400'>
                            <span className="inline-flex items-center mr-2 cursor-pointer" title='Likes' onClick={toggleVideoLike}>
                                <ThumbsUp
                                    strokeWidth={3}
                                    absoluteStrokeWidth
                                    className={video.isLiked ? "me-2 text-blue-600" : "me-2"}
                                />
                                {video.likes}
                            </span>
                            <span className="inline-flex items-center mr-2" title='Views'>
                                <Eye
                                    strokeWidth={3}
                                    absoluteStrokeWidth
                                    className="me-2"
                                />
                                {video.views}
                            </span>
                            <span className="inline-flex items-center mr-2" title='Uploaded at'>
                                <CalendarArrowDown
                                    strokeWidth={3}
                                    absoluteStrokeWidth
                                    className="me-2"
                                />
                                {parseDate(video.createdAt)}
                            </span>
                            <span
                                className="inline-flex items-center mr-2 cursor-pointer"
                                title='Add to playlist'
                                onClick={toggleModal} // Open the modal when clicked
                            >
                                <List
                                    strokeWidth={3}
                                    absoluteStrokeWidth
                                    className="me-2"
                                />
                                Add
                            </span>
                        </div>

                        <p className="mt-4 line-clamp-6 text-gray-400 mb-4" title='video.description'>{video.description}</p>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className='flex flex-col overflow-auto mt-4 ps-3'>
                <h1 className='text-xl font-semibold'>{comments.length} Comments</h1>

                <div name="ADD-COMMENT" className='flex items-start mt-4 w-full'>
                    <img
                        src={currentUser.avatar}
                        alt={`${currentUser.name} avatar`}
                        onError={e => e.target.src = img}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                    />

                    <textarea
                        className="mb-4 w-full p-2 me-4 bg-gray-900 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 resize-none"
                        rows="2"
                        placeholder="Write your comment..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className='flex justify-end space-x-4 mr-2 mb-4 text-slate-400'>
                    <button
                        onClick={() => setContent("")}
                        className="hover:text-white hover:bg-slate-800 px-2 rounded-full"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={addComment}
                    >
                        Comment
                    </button>
                </div>

                <div className='flex flex-col'>
                    {
                        comments.length ? (
                            comments.map(comment => (
                                <Comment
                                    key={comment._id}
                                    id={comment._id}
                                    content={comment.content}
                                    updatedAt={parseDate(comment.updatedAt)}
                                    likes={comment.likes}
                                    isLiked={comment.isLiked}
                                    fullname={comment.owner.fullname}
                                    username={comment.owner.username}
                                    avatar={comment.owner.avatar}
                                    toggleLike={toggleCommentLike}
                                    deleteComment={deleteComment}
                                />
                            ))
                        ) : (
                            null
                        )
                    }
                </div>
            </div>

            {/* Modal for selecting a playlist */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-900 text-white rounded-lg p-6 w-1/3 max-[800px]:w-full">
                        <div className="flex justify-between items-center">

                            <h2 className="text-xl font-semibold mb-4">Select a Playlist</h2>
                            <button
                                className=" px-4 py-2 text-white rounded-lg"
                                onClick={toggleModal}
                            >
                                <XMarkIcon className="h-7 w-7 text-white hover:bg-gray-500 hover:bg-opacity-15 rounded-xl" />

                            </button>

                        </div>
                        <ul className="rounded-lg shadow-inner shadow-slate-800">
                            {playlists.map(playlist => (
                                <li
                                    key={playlist._id}
                                    className="p-2 hover:bg-gray-700 rounded cursor-pointer"
                                    onClick={() => addToPlaylist(playlist._id)}
                                >
                                    {playlist.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideoPage;
