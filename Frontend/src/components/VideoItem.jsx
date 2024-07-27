import React from "react";
import thumbnail from "../assets/thumbnail.jpeg"

export default function VideoItem({title, description, owner, views, thumbnail}) {

    return (
        <div>
            <div className="flex place-content-center my-2 p-2 rounded-md">
                <div className="max-w-56 w-56 flex place-content-center my-auto">

                    <img src={thumbnail} alt="thumbnail" className="max-h-32 rounded-lg"/>
                </div>

                <div className="ms-4">
                    <h1 className="flex flex-wrap max-w-xl min-w-0 font-semibold text-xl truncate">
                        {title}
                    </h1>
                    <h1 className=" text-gray-400">
                        <span>{owner}</span>
                        <span> - {views} views</span>
                    </h1>
                    <h1 className="flex flex-wrap max-w-xl mt-2 text-gray-400 truncate">
                        {description}
                    </h1>
                </div>
            </div>
        </div>
    )
}