import React from "react";
import thumbnailAlt from "../assets/thumbnail.jpg";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { BadgeDollarSign } from "lucide-react";

export default function VideoItem({ 
    id, 
    title, 
    description, 
    owner, 
    views, 
    thumbnail, 
    duration, 
    isExclusive,
    // New props for purchase history
    purchasedAt,
    amount,
    playlistInfo
}) {
    const currentUser = useOutletContext();
    const navigate = useNavigate();

    return (
        <div
            className="flex max-w-2xl p-3 items-start flex-row rounded-md w-full sm:w-[600px] cursor-pointer"
            onClick={() => navigate(`/video/watch/${id}`)}
        >
            <div className="relative flex-shrink-0 my-auto w-40 sm:w-56 me-4">
                <img
                    src={thumbnail}
                    onError={e => e.target.src = thumbnailAlt}
                    alt="thumbnail"
                    className="w-full h-24 sm:h-32 object-cover rounded-lg"
                />
                <span className="absolute bottom-1 right-1 bg-black text-white text-xs p-1 rounded-sm">
                    {duration}
                </span>
                {isExclusive && (
                    <div className="absolute bottom-1 left-1 p-1 rounded-lg bg-black bg-opacity-40">
                        <BadgeDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 drop-shadow-lg stroke-2" />
                    </div>
                )}
            </div>
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
                    {/* Conditional rendering based on whether it's in purchase history */}
                    {purchasedAt ? (
                        <div className="text-gray-400 space-y-1">
                            {!playlistInfo && <p>Purchased on: {purchasedAt}</p>}
                            {amount && <p>Amount: ${amount}</p>}
                            {playlistInfo && (
                                <p>
                                    From playlist:{' '}
                                    <Link 
                                        to={`/playlist/u/${playlistInfo.ownerId}/p/${playlistInfo.playlistId}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-purple-400 font-semibold hover:underline"
                                    >
                                        {playlistInfo.name}
                                    </Link>
                                </p>
                            )}
                        </div>
                    ) : (
                        <h1 className="text-gray-400 line-clamp-2" title={description}>
                            {description}
                        </h1>
                    )}
                </div>
            </div>
        </div>
    );
}