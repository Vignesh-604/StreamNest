import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import thumbnailAlt from "../assets/thumbnail.jpeg"

export default function VideoItem({id, title, description, owner, views, thumbnail, duration, remove }) {
    return (
        <div className="flex items-start space-x-4 my-4 w-full">
            <div className="relative w-56 flex-shrink-0">
                <img src={thumbnail} onError={e => e.target.src = thumbnailAlt} alt="thumbnail" className="w-full h-32 object-cover rounded-lg" />
                <span className="absolute bottom-1 right-1 bg-black text-white text-xs p-1 rounded-sm">
                    {duration}
                </span>
            </div>
            <div className="flex flex-col justify-between flex-grow">
                <div className="text-sm">
                    <h1 className="font-semibold text-xl truncate">{title}</h1>
                    <h1 className="text-gray-400">
                        <span>{owner}</span>
                        <span> - {views} views</span>
                    </h1>
                    <h1 className="mt-2 text-gray-400 line-clamp-2">
                        {description}
                    </h1>
                </div>
            </div>
            <button onClick={() => remove(id)}>
                <XMarkIcon  className="ms-5 h-5 w-5 text-white" />
            </button>
        </div>
    );
}
