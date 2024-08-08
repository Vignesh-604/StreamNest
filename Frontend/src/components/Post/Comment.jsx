import { ThumbsUp, EllipsisVertical, PencilLine } from 'lucide-react';
import img from "../assets/profile.webp"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { PencilIcon, TrashIcon, } from '@heroicons/react/16/solid'
import { useOutletContext, Link } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';


export default function Comment({ id, content, updatedAt, likes, isLiked, fullname, username, avatar, toggleLike, deleteComment }) {

    const currentUser = useOutletContext()
    const [newContent, setNewContent] = useState(content)
    const [editMode, setEditMode] = useState(false)

    const editComment = () => {

        if ((newContent !== content) && newContent.trim() && newContent) {

            axios.post(`/api/comment/c/${id}`, { content: newContent })
                .then((res) => content = res.data.data.content)
                .catch(error => console.log(error))
        } else {
            setNewContent(content)
        }

        setEditMode(false)
    }

    return (
        <div className="container mx-auto p-4">
            <div className="border text-white p-4 rounded-lg mb-4 shadow-md">
                <div className="flex items-center mb-4 justify-between">
                    <div className='flex items-center'>
                        <img
                            src={avatar}
                            alt={`${fullname} avatar`}
                            onError={e => e.target.src = img}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                        <div>
                            <span className="font-semibold">{fullname}</span>
                            <span className="font-normal ms-2 text-gray-400">@{username}</span>
                            <div className="text-sm text-gray-400">{updatedAt}</div>
                        </div>
                    </div>
                    <div className='flex place-items-start'>
                        {
                            (username === currentUser.username) && !editMode ? (
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
                                            <Link
                                                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                                                onClick={() => setEditMode(true)}
                                            >
                                                <PencilIcon className="size-4 fill-white/30" />
                                                Edit
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                                                onClick={() => deleteComment(id)}
                                            >
                                                <TrashIcon className="size-4 fill-white/30" />
                                                Delete
                                            </a>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>

                            ) : null
                        }
                    </div>
                </div>

                {
                    editMode ? (
                        <textarea
                            className="mb-4 w-full p-2 me-4 bg-gray-900 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 resize-none"
                            rows="2"
                            placeholder="Write your comment..."
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                        />
                    ) : (
                        <div className="mb-4 whitespace-pre-line">{newContent}</div>
                    )
                }

                {
                    editMode ? (
                        <div className="flex justify-end text-gray-400">
                            <div className="flex text-gray-400">
                                <div className="flex items-center mr-4" onClick={() => setEditMode(false)}>
                                    <span className="flex items-center ml-2 cursor-pointer p-1 -my-1 rounded hover:bg-gray-800 hover:text-white">
                                        Cancel
                                    </span>
                                </div>
                                <div className="flex items-center mr-4" onClick={editComment}>
                                    <span className="flex items-center ml-2 cursor-pointer p-1 -my-1 rounded hover:bg-gray-800 hover:text-white">
                                        <PencilLine
                                            strokeWidth={2}
                                            absoluteStrokeWidth
                                            className="me-2 text-gray-400"
                                        />
                                        Edit comment
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between text-gray-400">
                            <div className="flex text-gray-400">
                                <div className="flex items-center mr-4" onClick={() => toggleLike(id)}>
                                    <span className="flex items-center mr-2 cursor-pointer">
                                        <ThumbsUp
                                            strokeWidth={3}
                                            absoluteStrokeWidth
                                            className={isLiked ? "me-2 text-blue-600" : "me-2"}
                                        />
                                        {likes}
                                        {/* {post.likes} */}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
