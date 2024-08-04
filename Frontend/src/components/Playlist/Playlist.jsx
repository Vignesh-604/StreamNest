import axios from "axios";
import img from "../assets/thumbnail.jpeg"
import { useEffect, useState } from "react";
import { parseDate, parseTime } from "../utility";
import VideoItem from "../Video/VideoItem";

export default function Playlist() {
    const [playlist, setPlaylist] = useState(null)

    useEffect(() => {
        axios.get(`/api/playlist/669acb14f5c6a7ec30ae2fba`)
            .then(res => setPlaylist(res.data.data))
            .catch(e => console.log(e))
    }, [])
    console.log(playlist);

    // Remove video from playlist broken
    const removeVideo = (plstId, vidId) => {
        axios.delete(`/api/playlist/video/${plstId}/${vidId}`)
        .then(res => console.log(res))
        .catch(e => console.log(e))
    }

    return (
        <div className="flex flex-col xl:flex-row place-items-center pb-12">
            {
                playlist ? (
                    <div className="flex flex-col md:flex-row max-md:w-full md:space-x-4">
                        <div className="flex flex-col items-center p-5 rounded-lg bg-gray-800">
                            <img
                                src={playlist.videos[0].thumbnail}
                                alt="User avatar"
                                onError={e => e.target.src = img}
                                className="h-56 rounded-lg  border object-cover w-full my-auto"
                            />

                            <div className="items-center py-4 w-full max-w-lg lg:w-[350px]">
                                <h1 className="text-4xl font-semibold m-2">
                                    {playlist.name}
                                </h1>
                                <h2 className="text-xl text-gray-400 m-2 line-clamp-3">
                                    {playlist.description} Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem architecto delectus officia error in et voluptatibus similique libero asperiores illo, blanditiis, ipsam saepe quod optio at doloribus, eum repellendus. Molestias!
                                </h2>
                                <hr className="ms-2 lg:me-10" />
                                <h2 className="text-lg text-gray-400 m-2">
                                    Playlist updated at: {parseDate(playlist.updatedAt)}
                                </h2>

                                <div className="flex flex-col space-y-2 ">
                                    <div className="flex flex-wrap w-full space-x-2 font-semibold border rounded-lg p-2 bg-slate-300 text-black">
                                        <img
                                            src={playlist.owner.avatar}
                                            onError={e => e.target.src = img}
                                            className="h-7 rounded" />
                                        <span className="font-bold">{playlist.owner.fullname}</span>
                                        <span>@{playlist.owner.username}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            {
                                playlist.videos.length ? (
                                    playlist.videos.map(vid => (
                                        <div key={vid._id} className="">
                                            <VideoItem key={vid._id}
                                                id={vid._id}
                                                title={vid.title}
                                                description={vid.description}
                                                owner={vid.owner.username}
                                                views={vid.views}
                                                thumbnail={vid.thumbnail}
                                                duration={parseTime(vid.duration)}
                                                toggleLike={() => removeVideo(playlist._id, vid._id)}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <h1 className="flex items-center font-semibold">No videos</h1>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <h1>Loading</h1>
                )
            }
        </div>
    )
}