import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoItem from "./VideoItem";
import { parseTime } from "../utility";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid'
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { EllipsisVertical, Plus } from "lucide-react";
import Loading from "../AppComponents/Loading";
import { showCustomAlert } from "../utility";


export default function ChannelVideos({ owner }) {
    const navigate = useNavigate()
    const currentUser = useOutletContext()

    const [loading, setLoading] = useState(true);  // Add loading state

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get(`/api/dashboard/videos/${currentUser._id}`)
            .then((res) =>{
                 setVideos(res.data.data)
                 setLoading(false);                 // Set loading to false after data is fetched
                })
            .catch(error => console.log(error));
    }, []);
    
    const deleteVideo = (vidId) => {
        axios.delete(`/api/video/v/${vidId}`)
            .then((res) => {
                setVideos(videos => videos.filter(vid => vid._id !== vidId))
                setTimeout(() => {
                    showCustomAlert('Video Deleted')
                }, 500)
            })
            .catch(error => console.log(error.response.data))
    }

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col px-4 min-w-[36rem]">
            <div className='flex justify-between'>
                <h1 className="font-bold text-start text-5xl mt-7 mb-10 mx-2">Videos</h1>
                {
                    currentUser._id === currentUser._id ? (
                        <Link className="font-bold text-start text-lg my-auto me-10 inline-flex" to={"/video/new"}>
                            New Video
                            <Plus strokeWidth={2} absoluteStrokeWidth className="ms-2 my-auto" />
                        </Link>
                    ) : null
                }

            </div>
            <div className={videos.length ? "grid gap-2 lg:grid-cols-2" : "flex justify-center"}>
                {
                    videos.length ?
                        (
                            videos.map((vid) => (
                                <div className="flex justify-between key={vid._id}" key={vid._id}>
                                    <VideoItem key={vid._id}
                                        id={vid._id}
                                        title={vid.title}
                                        description={vid.description}
                                        owner={currentUser}
                                        views={vid.views}
                                        thumbnail={vid.thumbnail}
                                        duration={parseTime(vid.duration)}
                                    />
                                    <div className="flex items-start mt-10">
                                        {
                                            currentUser._id === currentUser._id ? (
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
                                                            <Link 
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
                            <h1 className="flex justify-center font-bold text-3xl my-7">Channel has no Videos</h1>
                        )
                }
            </div>
        </div>
    );
}
