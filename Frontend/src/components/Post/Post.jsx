import { EllipsisVertical, ThumbsUp } from 'lucide-react';
import img from "../assets/profile.webp"
import Comment from './Comment';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { parseDate } from '../utility';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid'
import { useParams } from "react-router-dom";

export default function PostItem() {
    const {postId} = useParams()

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])

    useEffect(() => {
        axios.get(`/api/post/${postId}`)
            .then((res) => setPost(res.data.data))
            .catch(error => console.log(error));

        axios.get(`/api/comment/post/${postId}`)
            .then((res) => setComments(res.data.data.docs))
            .catch(error => console.log(error));
    }, []);

    const togglePostLike = (postId) => {
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

    return (
        <div className="container mx-auto p-4">
            {
                post ? (
                    <div className="bg-gray-800 lg:w-[1000px] text-white p-4 rounded-lg mb-4 shadow-md">
                        <div className="flex items-center mb-4 justify-between">
                            <div className='flex items-center'>
                                <img
                                    src={post.owner[0].avatar}
                                    alt={`${post.name} avatar`}
                                    onError={e => e.target.src = img}
                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                />
                                <div>
                                    <span className="font-semibold">{post.owner[0].fullname}</span>
                                    <span className="font-normal ms-2 text-gray-400">@{post.owner[0].username}</span>
                                    <div className="text-sm text-gray-400">{parseDate(post.updatedAt)}</div>
                                </div>
                            </div>
                            <button className='flex place-items-start'>
                                <Menu>
                                    <MenuButton className="">
                                        <EllipsisVertical />
                                    </MenuButton>

                                    <MenuItems
                                        transition
                                        anchor="bottom end"
                                        className="w-52 origin-top-right rounded-xl border border-white/20 bg-gray-800 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                                    >
                                        <MenuItem>
                                            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                <PencilIcon className="size-4 fill-white/30" />
                                                Edit
                                            </button>
                                        </MenuItem>
                                        <MenuItem>
                                            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                <TrashIcon className="size-4 fill-white/30" />
                                                Delete
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </button>
                        </div>
                        <div className="mb-4 whitespace-pre-line">{post.content}</div>
                        <div className="flex justify-between text-gray-400">
                            <div className="flex text-gray-400">
                                <div className="flex items-center mr-4">
                                    <span className="flex items-center mr-2 cursor-pointer" onClick={() => togglePostLike(post._id)}>
                                        <ThumbsUp
                                            strokeWidth={3}
                                            absoluteStrokeWidth
                                            className={post.isLiked ? "me-2 text-blue-600" : "me-2"}
                                        />
                                        {post.likes}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <h1 className='text-xl font-semibold'>Loading...</h1>
                )
            }
            <div className='container flex flex-col'>
                <h1 className='text-xl font-semibold'>{comments.length} Comments</h1>
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
                                />
                            ))
                        ) : (
                            null
                        )
                    }
                </div>
            </div>
        </div>
    );
}

