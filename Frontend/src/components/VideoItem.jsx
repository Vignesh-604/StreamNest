import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import thumbnailAlt from "../assets/thumbnail.jpeg"

export default function VideoItem({ id, title, description, owner, views, thumbnail, duration, cb }) {
    return (
        <div className="flex flex-col md:flex-row">
            <div className="flex max-w-2xl p-3 items-start flex-row hover:bg-slate-800 rounded-md my-3 w-full">
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
                            <span>{owner ? owner + " - " : null}</span>
                            <span>{views} views</span>
                        </h1>
                        <h1 className=" text-gray-400 line-clamp-2" title={description}>
                            {description}
                        </h1>
                    </div>
                </div>
            </div>
            {/* Cross mark */}
            <button onClick={() => cb(id)} className="flex justify-center md:items-center">
                <XMarkIcon className="m-2 h-7 w-7 text-white hover:bg-gray-500 hover:bg-opacity-15 rounded-xl" />
            </button>
        </div>
    );
}
