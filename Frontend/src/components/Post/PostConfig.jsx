import React, { useEffect, useState } from 'react';
import profile from "../assets/profile.webp";
import axios from 'axios';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import { EllipsisVertical, PenBoxIcon, Plus, ThumbsUp, X } from 'lucide-react';
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { parseDate } from '../utility';

export default function PostConfig() {

    const user = useOutletContext()
    const navigate = useNavigate()

    let location = useLocation()
    let editMode = (location.pathname).includes("/post/edit")


    const [post, setPost] = useState(null)
    const [content, setContent] = useState("")
    const [currContent, setCurrContent] = useState("")
    const { postId } = useParams()

    useEffect(() => {
        if (editMode) {

            axios.get(`/api/post/${postId}`)
                .then((res) => {
                    setPost(res.data.data)
                    setContent(res.data.data.content)
                    setCurrContent(res.data.data.content)
                })
                .catch(error => console.log(error));
        }

        else {
            setPost({
                owner: [{
                    avatar: user.avatar,
                    fullname: user.fullname,
                    username: user.username,
                }]
            })
        }
    }, [])

    const config = () => {
        if (editMode) {
            if (content !== currContent) {
                axios.post(`/api/post/${postId}`, { content })
                    .then(res => {
                        console.log(res)
                        navigate(-1)
                    })
                    .catch(error => console.log(error));
            }
            else navigate(-1)
        }
        else {
            if (!content || content.trim()) {
                axios.post(`/api/post/new`, { content })
                    .then(res => {
                        console.log(res)
                        navigate(-1)
                    })
                    .catch(error => console.log(error.response.data));
            }

        }
    }
    // console.log(post);

    return (
        <>
            {
                post ? (
                    <div className="bg-gray-800 w-[500px] md:w-[750px] lg:w-[1000px] text-white p-6 rounded-lg mb-6 shadow-md">
                        <div className="flex items-center mb-4 justify-between">
                            <div className='flex items-center'>
                                <img
                                    src={post.owner[0].avatar ? post.owner[0].avatar : profile}
                                    alt="Profile"
                                    onError={e => e.target.src = img}
                                    className="h-12 w-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <span className="font-semibold text-lg">{post.owner[0].fullname}</span>
                                    <span className="font-normal ml-2 text-gray-400">@{post.owner[0].username}</span>
                                    {
                                        editMode ? (
                                            <div className="text-sm text-gray-400">
                                                Last updated on: {parseDate(post.updatedAt)}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-400">New post</div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <textarea
                            className="mb-4 w-full p-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 resize-none"
                            rows="10"
                            placeholder="Write your post..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <div className="flex justify-end items-center pe-4 text-gray-400">
                            <div className="flex items-center space-x-10">
                                <button
                                    className="flex items-center text-gray-400 hover:text-white"
                                    onClick={() => navigate(-1)}
                                >
                                    <X strokeWidth={3} absoluteStrokeWidth className="" />
                                    Cancel
                                </button>
                                <button

                                    className="flex items-center text-gray-400 hover:text-white" onClick={config}
                                >
                                    {editMode ? (
                                        <>
                                            <PenBoxIcon strokeWidth={2} absoluteStrokeWidth className="mr-2" />
                                            Save Changes
                                        </>
                                    ) : (
                                        <>
                                            <Plus strokeWidth={2} absoluteStrokeWidth className="mr-2" />
                                            Create Post
                                        </>
                                    )}
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
