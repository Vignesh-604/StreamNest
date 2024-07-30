import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import thumbnailAlt from "../assets/thumbnail.jpeg"

export default function VideoItem({ id, title, description, owner, views, thumbnail, duration, remove }) {
    return (
        <div className="flex max-w-2xl p-3 flex-col items-start md:flex-row hover:bg-slate-800 rounded-md my-3 w-full">
            <div className="relative w-full flex-shrink-0 mx-auto md:w-56 md:me-4">
                {/* Cross mark */}
                <button onClick={() => remove(id)} className="absolute left-1">
                    <XMarkIcon className="m-2 h-7 w-7 text-white hover:bg-gray-500 hover:bg-opacity-15 rounded-xl" />
                </button>
                {/* Thumbnail */}
                <img src={thumbnail} onError={e => e.target.src = thumbnailAlt} alt="thumbnail" className="w-full h-32 object-cover rounded-lg" />
                {/* Duration  */}
                <span className="absolute bottom-1 right-1 bg-black text-white text-xs p-1 rounded-sm">
                    {duration}
                </span>
            </div>
            {/* Title, description and other details */}
            <div className="flex flex-col justify-between flex-grow mt-2">
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

        </div>
    );
}
