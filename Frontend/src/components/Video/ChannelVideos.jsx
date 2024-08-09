import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoItem from "./VideoItem";
import { parseTime } from "../utility";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid'
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import Loading from "../Loading";

export default function ChannelVideos({ owner }) {
    const navigate = useNavigate()
    const currentUser = useOutletContext()

    const [loading, setLoading] = useState(true);  // Add loading state

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get(`/api/dashboard/videos/${owner._id}`)
            .then((res) =>{
                 setVideos(res.data.data)
                 setLoading(false);                 // Set loading to false after data is fetched
                })
            .catch(error => console.log(error));
    }, []);
    
    const deleteVideo = (vidId) => {

        axios.delete(`/api/video/${vidId}`)
            .then((res) => console.log(res.data.data))  // doesn't log anything because page gets re-rendered
            .catch(error => console.log(error))
    }

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col px-4 min-w-[36rem]">
            <h1 className="font-bold text-start text-5xl mt-7 mb-10">Videos</h1>
            <div className="grid gap-2 lg:grid-cols-2">
                {
                    videos.length ?
                        (
                            videos.map((vid) => (
                                <div className="flex justify-between key={vid._id}" key={vid._id}>
                                    <VideoItem key={vid._id}
                                        id={vid._id}
                                        title={vid.title}
                                        description={vid.description}
                                        owner={owner}
                                        views={vid.views}
                                        thumbnail={vid.thumbnail}
                                        duration={parseTime(vid.duration)}
                                    />
                                    <div className="flex items-start mt-10">
                                        {
                                            owner._id === currentUser._id ? (
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
                                                                onClick={() => navigate(`/video/edit/${vid._id}`)}
                                                            >
                                                                <PencilIcon className="size-4 fill-white/30" />
                                                                Edit
                                                            </Link>
                                                        </MenuItem>
                                                        <MenuItem>
                                                            <Link reloadDocument
                                                                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                                                                onClick={() => deleteVideo(vid._id)}
                                                            >
                                                                <TrashIcon className="size-4 fill-white/30" />
                                                                Delete
                                                            </Link>
                                                        </MenuItem>
                                                    </MenuItems>
                                                </Menu>

                                            ) : null
                                        }
                                    </div>

                                </div>
                            ))
                        ) : (
                            <h1 className="flex place-content-center font-bold text-5xl my-7">Channel has no Videos</h1>
                        )
                }
            </div>
        </div>
    );
}
