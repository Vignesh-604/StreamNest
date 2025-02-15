import { useState, useEffect } from 'react';
import img from "../assets/profile.webp";
import axios from 'axios';
import { MessageSquareText, Plus, ThumbsUp } from 'lucide-react';
import { parseDate } from '../Utils/utility';
import { useOutletContext, useNavigate, useLocation, Link, useParams } from "react-router-dom";
import Loading from '../AppComponents/Loading';

export default function PostList() {

    let currentUser = useOutletContext()

    let {channelId} = useParams()
    let owner = (currentUser._id === channelId) || (channelId == undefined)

    const {state} = useLocation()
    currentUser = state !== null ? state : currentUser

/*  ## To change from using channelId as param to username
    let {username} = useParams()
    const {state} = useLocation()
    console.log(state)
    currentUser = state !== null ? state : currentUser
    // channelId = currentUser._id
    // console.log(channelId)

    const [posts, setPosts] = useState([]);
    const id = username !== currentUser.username ? currentUser._id : state._id;
*/

    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const [posts, setPosts] = useState([]);
    const id = !channelId ? currentUser._id : channelId;

    useEffect(() => {
        axios.get(`/api/post/user/${id}`)
            .then((res) => {
                setPosts(res.data.data)
                setLoading(false)
            })
            .catch(error => console.log(error));
    }, []);

    const togglePostLike = (e, postId) => {
        e.stopPropagation()

        axios.post(`/api/like/p/${postId}`)
            .then((res) => setPosts(
                posts => posts.map(post =>
                    post._id === postId ? {
                        ...post,
                        isLiked: !post.isLiked,
                        likes: post.isLiked ? post.likes - 1 : post.likes + 1
                    } : post
                )
            ))
            .catch(error => console.log(error));
    }

    if (loading) return <Loading />

    return (
        <div className="flex flex-col items-center bg-[#0a0a26]/40 text-white px-6 py-8 min-h-screen">
            <div className="bg-[#24273a] rounded-lg p-8 mb-8 w-full ">
                <div className='flex justify-between mb-10'>
                    <h1 className="font-extrabold text-start text-4xl">Posts</h1>
                    {
                        owner && (
                            <Link to={"/post/new"}
                                className="flex items-center gap-2 bg-[#8A3FFC] hover:bg-[#7B37E5] font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                <Plus className="w-5 h-5" />
                                New Post
                            </Link>
                        )
                    }

                </div>
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center">
                        {
                            posts.length !== 0 ? (
                                posts.map((post, index) => (
                                    <div key={index} onClick={() => navigate(`p/${post._id}`)}
                                        className="card text-white p-4 mb-6 shadow-md w-full"
                                    >
                                        <div className="flex items-center mb-4">
                                            <img
                                                src={currentUser.avatar}
                                                alt={`${currentUser.fullname} avatar`}
                                                onError={e => e.target.src = img}
                                                className="h-10 w-10 rounded-full object-cover mr-3"
                                            />
                                            <div>
                                                <span className="font-semibold">{currentUser.fullname}</span>
                                                <span className="font-normal ms-2 text-gray-400">@{currentUser.username}</span>

                                                <div className="text-sm text-gray-400">{parseDate(post.updatedAt)}</div>
                                            </div>
                                        </div>
                                        <div className="mb-4 whitespace-pre-line">{post.content}</div>
                                        <div className="flex text-gray-400">
                                            <div className="flex items-center mr-4">
                                                <span className="flex items-center mr-2 cursor-pointer" onClick={(e) => togglePostLike(e, post._id)}>
                                                    <ThumbsUp
                                                        strokeWidth={3}
                                                        absoluteStrokeWidth
                                                        className={post.isLiked ? "me-2 text-purple-500" : "me-2"}
                                                    />
                                                    {post.likes}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="flex items-center cursor-pointer">
                                                    <MessageSquareText className='me-2' />
                                                    {post.comments}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <h1 className="font-bold text-center text-3xl mt-7">You have no posts</h1>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
