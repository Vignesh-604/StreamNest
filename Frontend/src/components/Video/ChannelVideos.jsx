import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoItem from "./VideoItem";
import { parseTime, showCustomAlert } from "../Utils/utility";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { useOutletContext, useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { EllipsisVertical, Plus } from "lucide-react";
import Loading from "../AppComponents/Loading";

export default function ChannelVideos() {
    const navigate = useNavigate()
    let currentUser = useOutletContext()

    let {channelId} = useParams()
    let owner = (currentUser._id === channelId) || (channelId == undefined)

    const {state} = useLocation()
    currentUser = state !== null ? state : currentUser

    const [loading, setLoading] = useState(true);  // Add loading state

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get(`/api/dashboard/videos/${currentUser._id}`)
            .then((res) => {
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
        <div className="flex flex-col items-center bg-[#0a0a26]/40 text-white px-6 py-8 min-h-screen">
            <div className="bg-[#24273a] rounded-lg p-8 mb-8 w-full ">
                <div className='flex justify-between mb-6'>
                    {/* <h1 className="font-bold text-start text-5xl mt-7 mb-10 mx-2">Videos</h1> */}
                    <h1 className="font-extrabold text-start text-4xl">{owner ? "Your " : `${currentUser.fullname}'s `}Videos</h1>
                    {
                        owner && (
                            <Link to={"/video/new"}
                                className="flex items-center gap-2 font-semibold bg-[#8A3FFC] hover:bg-[#7B37E5] px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                <Plus className="w-5 h-5" />
                                New Video
                            </Link>
                        )
                    }

                </div>
                <div className={videos.length ? "grid gap-4 lg:grid-cols-1" : "flex justify-center"}>
                    {
                        videos.length ?
                            (
                                videos.map((vid) => (
                                    <div className="flex justify-between card" key={vid._id}>
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
                                                owner && (
                                                    <Menu>
                                                        <MenuButton className="flex justify-center md:items-center transform hover:scale-120">
                                                            <EllipsisVertical className="m-2 h-7 w-7 text-white hover:bg-gray-500/20 hover:bg-opacity-15 rounded-xl" />
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

                                                )
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
        </div>
    );
}
