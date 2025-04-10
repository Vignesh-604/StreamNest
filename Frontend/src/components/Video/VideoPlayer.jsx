import axios from "axios";
import profile from "../assets/profile.webp";
import img from "../assets/thumbnail.jpg";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import Loading from '../AppComponents/Loading';
import { parseDate, timeAgo } from '../Utils/utility';
import { BadgeDollarSign, BellRing, CalendarArrowDown, Eye, List, SquarePlay, ThumbsUp, UserPlus } from 'lucide-react';
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
    const [moreVideos, setMoreVideos] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    let owner = currentUser._id === video?.owner._id
    console.log(owner)

    // Load Video and comments
    useEffect(() => {
        setLoading(true);
        setDataLoaded(false);
        
        // Fetch video details
        const fetchVideoDetails = axios.get(`/api/video/v/${videoId}`)
            .then((res) => {
                const videoDetails = res.data;
                console.log(videoDetails.data)
                setVideo(videoDetails.data);
            })
            .catch(error => {
                console.log("Error fetching video:", error);
                if (error.response && error.response.status === 401) {
                    navigate(`/video/buy/${videoId}`);
                }
            });

        // Fetch comments
        const fetchComments = axios.get(`/api/comment/video/${videoId}`)
            .then((res) => setComments(res.data.data))
            .catch(error => console.log("Error fetching comments:", error));

        // Track watch history
        const trackWatchHistory = axios.post(`/api/watchHistory/track/${videoId}`)
            .catch(error => console.log("Error tracking history:", error));

        // Fetch more videos
        const fetchMoreVideos = axios.get(`/api/dashboard/more/${owner ? currentUser._id : video?.owner?._id}`)
            .then((res) => {
                setMoreVideos(res.data.data || []);
            })
            .catch(error => console.log("Error fetching more videos:", error));

        // Wait for all requests to complete
        Promise.all([fetchVideoDetails, fetchComments, trackWatchHistory, fetchMoreVideos])
            .then(() => {
                setLoading(false);
                setDataLoaded(true);
            })
            .catch(error => {
                console.log("Error in Promise.all:", error);
                setLoading(false);
            });
    }, [videoId, currentUser._id]);

    // Subscribe/ unsubscribe
    const toggleSub = () => {
        if (!video || !video.owner) return;
        
        axios.post(`/api/subscription/channel/${video.owner._id}`)
            .then(res => {
                setVideo({
                    ...video,
                    isSubscribed: !video.isSubscribed,
                    subscribers: res.data.data == null ? --video.subscribers : ++video.subscribers
                })
            })
            .catch(e => console.log(e.response?.data || e));
    }

    // Like / unlike video
    const toggleVideoLike = () => {
        if (!videoId) return;
        
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
        if (!content || !content.trim() || !videoId) return;

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

    // Delete comment
    const deleteComment = (id) => {
        if (!id) return;
        
        axios.delete(`/api/comment/c/${id}`)
            .then((res) => setComments(comments => comments.filter(com => com._id !== id)))
            .catch(error => console.log(error))
    }

    // Toggle comment like
    const toggleCommentLike = (commentId) => {
        if (!commentId) return;
        
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
        if (!isModalOpen && currentUser && currentUser._id) {
            // Fetch playlists only when opening the modal
            axios.get(`/api/playlist/user/${currentUser._id}`)
                .then((res) => setPlaylists(res.data.data || []))
                .catch(error => console.log(error.response?.data || error));
        }
    }

    // Add video to selected playlist 
    const addToPlaylist = (playlistId) => {
        if (!videoId || !playlistId) return;
        
        axios.post(`/api/playlist/video/${videoId}/${playlistId}`)
            .then(res => {
                console.log('Video added to playlist');
                setIsModalOpen(false);  // Close the modal after adding
            })
            .catch(error => console.log(error.response?.data || error));
    };

    if (loading) return <Loading />;
    
    // Safety check - if video data isn't loaded properly
    if (!dataLoaded || !video) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-white">
                <h2 className="text-2xl font-semibold mb-4">Unable to load video</h2>
                <p className="text-gray-400 mb-4">There was a problem loading this video.</p>
                <button 
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                    Return to home
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col mx-14 max-w-screen-2xl">
            <div className="text-white flex gap-6 max-xl:items-start">
                <div className="flex flex-col xl:w-[70%] w-full">
                    {/* Video Player Section */}
                    <div className="w-full h-[580px] flex mt-5 justify-center items-center rounded-lg bg-black">
                        <video
                            className="w-full h-full object-contain rounded-lg"
                            controls
                            controlsList="nodownload"
                            poster={video?.thumbnail ? video.thumbnail : img}
                            autoPlay muted
                            onError={e => e.target.poster = img}
                        >
                            <source src={video?.videoFile} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Video Details Section */}
                    <div className="w-full p-4 flex flex-col">
                        <div>
                            <h1 className="text-2xl font-semibold mb-4 lg:line-clamp-3">
                                {video?.title || "Untitled Video"}
                            </h1>

                            <div className='flex flex-row justify-between max-[500px]:flex-col mb-4'>
                                {video?.owner && (
                                    <div
                                        className="flex items-center text-sm text-gray-400 py-1 group cursor-pointer transition-all duration-200 hover:scale-110"
                                        title={video.owner.fullname}
                                        onClick={() => navigate(video.owner._id !== currentUser._id ? `/channel/${video.owner._id}` : "/channel")}
                                    >
                                        <img
                                            src={video.owner.avatar ? video.owner.avatar : profile}
                                            alt="Channel Logo"
                                            className="h-12 w-12 rounded-full border-2 mr-2 border-transparent transition-all duration-300 group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/20"
                                            onError={e => e.target.src = profile}
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
                                )}
                                
                                {video?.owner && video.owner._id !== currentUser._id && (
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
                                )}
                            </div>

                            <div className='flex flex-row items-center gap-x-8 w-full text-gray-400'>
                                <span className="inline-flex items-center mr-2 cursor-pointer" title='Likes' onClick={toggleVideoLike}>
                                    <ThumbsUp
                                        strokeWidth={3}
                                        absoluteStrokeWidth
                                        className={video.isLiked ? "me-2 text-blue-600" : "me-2"}
                                    />
                                    {video.likes || 0}
                                </span>
                                <span className="inline-flex items-center mr-2" title='Views'>
                                    <Eye
                                        strokeWidth={3}
                                        absoluteStrokeWidth
                                        className="me-2"
                                    />
                                    {video.views || 0}
                                </span>
                                <span className="inline-flex items-center mr-2" title='Uploaded at'>
                                    <CalendarArrowDown
                                        strokeWidth={3}
                                        absoluteStrokeWidth
                                        className="me-2"
                                    />
                                    {video.createdAt ? parseDate(video.createdAt) : "Unknown date"}
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

                            <p className="mt-4 line-clamp-6 text-gray-400 mb-4" title={video.description || ''}>
                                {video.description || "No description available"}
                            </p>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className='flex flex-col overflow-auto mt-4 ps-3'>
                        <h1 className='text-xl font-semibold'>{comments.length} Comments</h1>

                        <div name="ADD-COMMENT" className='flex items-start mt-4 w-full'>
                            <img
                                src={currentUser?.avatar}
                                alt={`${currentUser?.name || 'User'} avatar`}
                                onError={e => e.target.src = profile}
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
                                className="hover:text-white hover:bg-slate-800 px-2 rounded-full"
                            >
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
                                        updatedAt={comment.updatedAt ? parseDate(comment.updatedAt) : ""}
                                        likes={comment.likes || 0}
                                        isLiked={comment.isLiked || false}
                                        fullname={comment.owner?.fullname || "Anonymous"}
                                        username={comment.owner?.username || "user"}
                                        avatar={comment.owner?.avatar || profile}
                                        toggleLike={toggleCommentLike}
                                        deleteComment={deleteComment}
                                    />
                                ))
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* More Videos Section - Hidden on lg screens and below */}
                <div className="hidden xl:flex flex-col w-[30%] mt-5 gap-4">
                    <h2 className="text-xl font-semibold mb-2">More videos</h2>
                    {moreVideos && moreVideos.length > 0 ? (
                        moreVideos.map(videoItem => (
                            <div 
                                key={videoItem._id} 
                                className="flex gap-2 p-2 card"
                                onClick={() => navigate(`/video/watch/${videoItem._id}`)}
                            >
                                <img
                                    src={videoItem.thumbnail || img}
                                    alt={videoItem.title || "Video thumbnail"}
                                    className="w-40 h-24 object-cover rounded-lg"
                                    onError={e => e.target.src = img}
                                />
                                <div className="flex flex-col">
                                    <h3 className="font-medium line-clamp-2">{videoItem.title || "Untitled video"}</h3>
                                    <p className="text-sm text-gray-400">{videoItem.views || 0} views</p>
                                    <p className="text-sm text-gray-400">{videoItem.createdAt ? timeAgo(videoItem.createdAt) : "Unknown"}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No more videos available</p>
                    )}
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
                        {playlists && playlists.length > 0 ? (
                            <ul className="rounded-lg shadow-inner shadow-slate-800">
                                {
                                    playlists.map(playlist => (
                                        <li
                                            key={playlist._id}
                                            className="p-2 hover:bg-gray-700 rounded cursor-pointer flex justify-between"
                                            onClick={() => addToPlaylist(playlist._id)}
                                        >
                                            <h1>{playlist.name}</h1>
                                            <span className="flex">
                                                {playlist.isExclusive && <BadgeDollarSign className="text-green-500 mr-2" />}
                                                {playlist.videos?.length || 0} <SquarePlay />
                                            </span>
                                        </li>
                                    ))
                                }
                            </ul>
                        ) : (
                            <h1 className="font-semibold mt-6">No playlists available</h1>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideoPage;