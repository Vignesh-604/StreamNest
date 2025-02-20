import React, { useEffect, useState } from 'react';
import { EllipsisVertical, ThumbsUp, PencilIcon, TrashIcon } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useOutletContext, useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import img from "../assets/profile.webp";
import Comment from './Comment';
import Loading from '../AppComponents/Loading';
import { parseDate, showCustomAlert } from "../Utils/utility";

export default function PostItem() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const currentUser = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState();

    useEffect(() => {
        axios.get(`/api/post/${postId}`)
            .then((res) => {
                setPost(res.data.data)
                setLoading(false)
            })
            .catch(error => error.response.status >= 500 ? navigate(-1) : console.log(error));

        axios.get(`/api/comment/post/${postId}`)
            .then((res) => setComments(res.data.data))
            .catch(error => console.log(error));
    }, []);

    const togglePostLike = (e) => {
        e.stopPropagation()

        axios.post(`/api/like/p/${postId}`)
            .then((res) => setPost(
                post => ({
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                })
            ))
            .catch(error => console.log(error));
    }

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
    }

    const deletePost = () => {
        axios.delete(`/api/post/${postId}`)
            .then((res) => {
                navigate(-1)
                setTimeout(() => {
                    showCustomAlert('Post Deleted')
                }, 500)
            })
            .catch(error => console.log(error))
    }

    const addComment = () => {
        if (content && content.trim()) {

            axios.post(`/api/comment/post/${postId}`, { content })
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
    const deleteComment = (id) => {
        axios.delete(`/api/comment/c/${id}`)
            .then((res) => setComments(comments => comments.filter(com => com._id !== id)))
            .catch(error => console.log(error))
    }

    if (loading) return <Loading />

    return (
        <div className="container mx-auto p-4 flex flex-col items-center md:mt-10">
            {post ? (
                <div className="bg-gray-900 max-sm:w-[400px] md:w-[700px] lg:w-[1000px] w-full text-white p-6 rounded-lg mb-4 shadow-lg border border-purple-500/20">
                    <div className="flex items-center mb-4 justify-between">
                        <div className="flex items-center">
                            <img
                                src={post.owner[0].avatar}
                                alt={`${post.name} avatar`}
                                onError={e => e.target.src = img}
                                className="h-10 w-10 rounded-full object-cover mr-3 border-2 border-purple-500/30"
                            />
                            <div>
                                <span className="font-semibold text-purple-100">{post.owner[0].fullname}</span>
                                <span className="font-normal ms-2 text-gray-400">@{post.owner[0].username}</span>
                                <div className="text-sm text-gray-400/70">{parseDate(post.updatedAt)}</div>
                            </div>
                        </div>
                        <div className="flex place-items-start">
                            {post.owner[0]._id === currentUser._id ? (
                                <Menu>
                                    <MenuButton className="hover:text-purple-400 transition-colors">
                                        <EllipsisVertical />
                                    </MenuButton>

                                    <MenuItems
                                        transition
                                        anchor="bottom end"
                                        className="w-52 origin-top-right rounded-xl border border-purple-500/20 bg-gray-900 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                                    >
                                        <MenuItem>
                                            <Link
                                                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-purple-500/10 transition-colors"
                                                onClick={() => navigate(`/post/edit/${postId}`)}
                                            >
                                                <PencilIcon className="size-4 text-purple-400" />
                                                Edit
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-purple-500/10 transition-colors"
                                                onClick={deletePost}
                                            >
                                                <TrashIcon className="size-4 text-purple-400" />
                                                Delete
                                            </a>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            ) : null}
                        </div>
                    </div>
                    <div className="mb-4 whitespace-pre-line text-gray-100">{post.content}</div>
                    <div className="flex justify-between text-purple-200">
                        <div className="flex">
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
                        </div>
                    </div>
                </div>
            ) : (
                <h1 className="text-xl font-semibold text-purple-100">Loading...</h1>
            )}

            <div className="container flex flex-col max-w-[1000px]">
                <h1 className="text-xl font-semibold text-purple-100 mb-4">{comments.length} Comments</h1>

                <div className="flex items-start mt-4 w-full">
                    <img
                        src={currentUser.avatar}
                        alt={`${currentUser.name} avatar`}
                        onError={e => e.target.src = img}
                        className="h-10 w-10 rounded-full object-cover mr-3 border-2 border-purple-500/30"
                    />
                    <textarea
                        className="mb-4 w-full p-2 me-4 bg-gray-900 border border-purple-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                        rows="2"
                        placeholder="Write your comment..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="flex justify-end space-x-4 mr-2 mb-4">
                    <button
                        onClick={() => setContent("")}
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-4 py-1 rounded-full transition-colors"
                    >
                        Cancel
                    </button>
                    <Link
                        onClick={addComment}
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-4 py-1 rounded-full transition-colors"
                    >
                        Comment
                    </Link>
                </div>

                <div className="flex flex-col">
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
    );
}


