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
    purchasedAt,
    amount,
    playlistInfo
}) {
    const currentUser = useOutletContext();
    const navigate = useNavigate();

    return (
        <div
            className="flex max-w-2xl p-2 sm:p-3 items-start flex-row rounded-md w-full cursor-pointer hover:bg-gray-800/20 transition-colors"
            onClick={() => navigate(`/video/watch/${id}`)}
        >
            {/* Responsive thumbnail with smaller size on mobile */}
            <div className="relative flex-shrink-0 my-auto w-24 h-16 xs:w-32 xs:h-20 sm:w-40 sm:h-24 md:w-48 md:h-28 me-2 sm:me-4">
                <img
                    src={thumbnail}
                    onError={e => e.target.src = thumbnailAlt}
                    alt="thumbnail"
                    className="w-full h-full object-cover rounded-lg"
                />
                <span className="absolute bottom-1 right-1 bg-black text-white text-xs p-0.5 sm:p-1 rounded-sm">
                    {duration}
                </span>
                {isExclusive && (
                    <div className="absolute bottom-1 left-1 p-0.5 sm:p-1 rounded-lg bg-black bg-opacity-40">
                        <BadgeDollarSign className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-400 drop-shadow-lg stroke-2" />
                    </div>
                )}
            </div>
            
            {/* Content section with responsive text sizes */}
            <div className="flex flex-col justify-between flex-grow mt-0 sm:mt-1 w-full overflow-hidden">
                <div className="text-xs sm:text-sm">
                    <h1 className="font-semibold text-sm xs:text-base sm:text-lg md:text-xl line-clamp-1 sm:line-clamp-2" title={title}>
                        {title}
                    </h1>
                    
                    <h1 className="text-gray-400 my-1 sm:my-2 text-xs sm:text-sm truncate">
                        <span 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(owner._id !== currentUser._id ? `/channel/${owner._id}` : "/channel");
                            }}
                            className="hover:text-purple-400"
                        >
                            {owner?.username}
                        </span>
                        <span> · {views} views</span>
                    </h1>
                    
                    {/* Conditional rendering based on whether it's in purchase history */}
                    {purchasedAt ? (
                        <div className="text-gray-400 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
                            {!playlistInfo && <p className="truncate">Purchased on: {purchasedAt}</p>}
                            {amount && <p className="truncate">Amount: ${amount}</p>}
                            {playlistInfo && (
                                <p className="truncate">
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
                        <h1 className="text-gray-400 line-clamp-1 sm:line-clamp-2 text-xs sm:text-sm" title={description}>
                            {description}
                        </h1>
                    )}
                </div>
            </div>
        </div>
    );
}