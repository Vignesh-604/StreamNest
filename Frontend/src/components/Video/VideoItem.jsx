import React from "react";
import thumbnailAlt from "../assets/thumbnail.jpg";
import { useNavigate, useOutletContext } from "react-router-dom";
import { BadgeDollarSign } from "lucide-react";

export default function VideoItem({ id, title, description, owner, views, thumbnail, duration, isExclusive }) {
    const currentUser = useOutletContext();
    const navigate = useNavigate();

    return (
        <div
            className="flex max-w-2xl p-3 items-start flex-row rounded-md w-full sm:w-[600px] cursor-pointer"
            onClick={() => navigate(`/video/watch/${id}`)}
        >
            <div className="relative flex-shrink-0 my-auto w-40 sm:w-56 me-4">
                {/* Thumbnail */}
                <img
                    src={thumbnail}
                    onError={e => e.target.src = thumbnailAlt}
                    alt="thumbnail"
                    className="w-full h-24 sm:h-32 object-cover rounded-lg"
                />
                {/* Duration */}
                <span className="absolute bottom-1 right-1 bg-black text-white text-xs p-1 rounded-sm">
                    {duration}
                </span>
                {/* Lock Icon with enhanced visibility */}
                {
                    isExclusive && (
                        <div className="absolute bottom-1 left-1 p-1 rounded-lg bg-black bg-opacity-40">
                            <BadgeDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 drop-shadow-lg stroke-2" />
                        </div>
                    )
                }
            </div>
            {/* Title, description and other details */}
            <div className="flex flex-col justify-between flex-grow mt-2 w-full">
                <div className="text-sm">
                    <h1 className="font-semibold text-lg sm:text-xl line-clamp-2" title={title}>{title}</h1>
                    <h1 className="text-gray-400 my-2">
                        <span onClick={(e) => {
                            e.stopPropagation()
                            navigate(owner._id !== currentUser._id ? `/channel/${owner._id}` : "/channel")
                        }}>
                            {owner?.username}
                        </span>
                        <span> · {views} views</span>
                    </h1>
                    <h1 className="text-gray-400 line-clamp-2" title={description}>
                        {description}
                    </h1>
                </div>
            </div>
        </div>
    );
}