import React from "react";
import thumbnailAlt from "../assets/thumbnail.jpeg"
import { useNavigate, useOutletContext } from "react-router-dom"

export default function VideoItem({ title, description, owner, views, thumbnail, duration }) {
    const currentUser = useOutletContext()
    const navigate = useNavigate()

    return (

        <div className="flex max-w-2xl p-3 items-start flex-row hover:bg-slate-800 rounded-md my-3 w-[600px] cursor-pointer" onClick={() => console.log("hello")
        }>
            <div className="relative flex-shrink-0 my-auto w-56 me-4">

                {/* Thumbnail */}
                <img src={thumbnail} onError={e => e.target.src = thumbnailAlt} alt="thumbnail" className="w-full h-32 object-cover rounded-lg" />
                {/* Duration  */}
                <span className="absolute bottom-1 right-1 bg-black text-white text-xs p-1 rounded-sm">
                    {duration}
                </span>
            </div>
            {/* Title, description and other details */}
            <div className="flex flex-col justify-between flex-grow mt-2 w-full">
                <div className="text-sm">
                    <h1 className="font-semibold text-xl line-clamp-2" title={title}>{title}</h1>
                    <h1 className="text-gray-400 my-2">

                        <span onClick={(e) => {
                            e.stopPropagation()
                            navigate(owner._id !== currentUser._id ? `/channel/${owner._id}` : "/channel")
                        }}>
                            {owner.username}
                        </span>
                        <span> · {views} views</span>
                    </h1>
                    <h1 className=" text-gray-400 line-clamp-2" title={description}>
                        {description}
                    </h1>
                </div>
            </div>
        </div>

    );
}
