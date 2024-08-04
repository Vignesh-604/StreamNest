import { ThumbsUp, EllipsisVertical } from 'lucide-react';
import img from "../assets/profile.webp"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/16/solid'


export default function Comment({ id, content, updatedAt, likes, isLiked, fullname, username, avatar, toggleLike }) {
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
                <div className="mb-4 whitespace-pre-line">{content}</div>
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
            </div>
        </div>
    );
}
