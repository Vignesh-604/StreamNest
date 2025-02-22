import axios from "axios";
import profile from "../assets/profile.webp";
import img from "../assets/thumbnail.jpg";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import Loading from '../AppComponents/Loading';
import { parseDate } from '../Utils/utility';
import { BellRing, CalendarArrowDown, Eye, List, ThumbsUp, UserPlus } from 'lucide-react';
import Comment from '../Post/Comment';
import { X } from "lucide-react";

function VideoPage() {
    const currentUser = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playlists, setPlaylists] = useState([]);

    // Dummy data for channel videos
    const channelVideos = [
        { id: 1, title: "Sample Video 1", views: "12K", timestamp: "2 days ago", thumbnail: img },
        { id: 2, title: "Sample Video 2", views: "8K", timestamp: "4 days ago", thumbnail: img },
        { id: 3, title: "Sample Video 3", views: "15K", timestamp: "1 week ago", thumbnail: img },
        { id: 4, title: "Sample Video 4", views: "20K", timestamp: "2 weeks ago", thumbnail: img },
    ];

    // Load Video and comments
    useEffect(() => {
        axios.get(`/api/video/v/${videoId}`)
            .then((res) => {
                const videoDetails = res.data
                if (videoDetails.status === 401) {
                    navigate(`/video/buy/${videoId}`)
                }
                setVideo(videoDetails.data);
                setLoading(false)
            })
            .catch(error => console.log(error.response.data));

        axios.get(`/api/comment/video/${videoId}`)
            .then((res) => setComments(res.data.data))
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
            <div className="text-white flex gap-6 max-xl:items-start">
                <div className="flex flex-col xl:w-[70%] w-full">
                    {/* Video Player Section */}
                    <div className="w-full max-h-[580px] flex mt-5 justify-center items-center rounded-lg bg-black">
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
                    <div className="w-full p-4 flex flex-col">
                        <div>
                            <h1 className="text-2xl font-semibold mb-4 lg:line-clamp-3">
                                {video.title}
                            </h1>

                            <div className='flex flex-row justify-between max-[500px]:flex-col mb-4'>
                                <div
                                    className="flex items-center text-sm text-gray-400 py-1 group cursor-pointer transition-all duration-200 hover:scale-110"
                                    title={video.owner.fullname}
                                    onClick={() => navigate(video.owner._id !== currentUser._id ? `/channel/${video.owner._id}` : "/channel")}
                                >
                                    <img
                                        src={video.owner.avatar ? video.owner.avatar : profile}
                                        alt="Channel Logo"
                                        className="h-12 w-12 rounded-full border-2 mr-2 border-transparent transition-all duration-300 group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/20"
                                    />
                                    <div>
                                        <p className="font-semibold transition-all duration-300 group-hover:text-emerald-400">
                                            {video.owner.fullname}
                                        </p>
                                        <p className="text-sm text-gray-400 transition-all duration-300 group-hover:text-emerald-300">
                                            {video.subscribers} subscribers
                                        </p>
                                    </div>
                                </div>
                                {
                                    video.owner._id !== currentUser._id && (
                                        <button
                                            onClick={toggleSub}
                                            className={`group cursor-pointer relative flex items-center justify-center gap-2 w-48 py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 
                                            ${video.isSubscribed
                                                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                                                } shadow-lg hover:shadow-xl hover:shadow-purple-500/20`}
                                        >
                                            {video.isSubscribed ? (
                                                <>
                                                    <BellRing className="w-5 h-5 transition-transform group-hover:scale-110" />
                                                    <span className="transition-all">Subscribed</span>
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="w-7 h-7 transition-transform group-hover:scale-110" />
                                                    <span className="transition-all text-xl">Subscribe</span>
                                                </>
                                            )}
                                        </button>
                                    )
                                }
                            </div>

                            <div className='flex flex-row items-center gap-x-8 w-full text-gray-400'>
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
                                    onClick={toggleModal}
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
                            <button onClick={addComment}>
                                Comment
                            </button>
                        </div>

                        <div className='flex flex-col'>
                            {comments.length ? (
                                comments.map(comment => (
                                    <Comment
                                        key={comment._id}
                                        id={comment._id}
                                        content={comment.content}
                                        updatedAt={parseDate(comment.updatedAt)}
                                        likes={comment.likes}
                                        isLiked={comment.isLiked}
                                        fullname={comment.owner?.fullname}
                                        username={comment.owner?.username}
                                        avatar={comment.owner?.avatar}
                                        toggleLike={toggleCommentLike}
                                        deleteComment={deleteComment}
                                    />
                                ))
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Channel Videos Section - Hidden on lg screens and below */}
                <div className="hidden xl:flex flex-col w-[30%] mt-5 gap-4">
                    <h2 className="text-xl font-semibold mb-2">More from this channel</h2>
                    {channelVideos.map(video => (
                        <div key={video.id} className="flex gap-2 cursor-pointer hover:bg-gray-800 rounded-lg p-2">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-40 h-24 object-cover rounded-lg"
                            />
                            <div className="flex flex-col">
                                <h3 className="font-medium line-clamp-2">{video.title}</h3>
                                <p className="text-sm text-gray-400">{video.views} views</p>
                                <p className="text-sm text-gray-400">{video.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for selecting a playlist */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-900 text-white rounded-lg p-6 w-1/3 max-[800px]:w-full">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold mb-4">Select a Playlist</h2>
                            <button
                                className="px-4 py-2 text-white rounded-lg"
                                onClick={toggleModal}
                            >
                                <X className="h-7 w-7 text-white hover:bg-gray-500 hover:bg-opacity-15 rounded-xl" />
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
