import { ThumbsUp, ThumbsUpIcon } from 'lucide-react';
import img from "../assets/profile.webp"


export default function Comment({ id, content, updatedAt, likes, isLiked, fullname, username, avatar, toggleLike }) {
    return (
        <div className="container mx-auto p-4">
            <div className="border text-white p-4 rounded-lg mb-4 shadow-md">
                <div className="flex items-center mb-4">
                    <img
                        src={avatar}
                        alt={`${fullname} avatar`}
                        onError={e => e.target.src = img}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                    <div>
                        <span className="font-semibold">{fullname}</span>
                        <span className="font-normal ms-2 text-gray-400">@{username}</span>
                        <div className="text-sm text-gray-400">{updatedAt}</div>
                    </div>
                </div>
                <div className="mb-4 whitespace-pre-line">{content}</div>
                <div className="flex justify-between text-gray-400">
                    <div className="flex text-gray-400">
                        <div className="flex items-center mr-4" onClick={() => toggleLike(id)}>
                            <span className="flex items-center mr-2 cursor-pointer">
                                <ThumbsUp
                                    strokeWidth={3}
                                    absoluteStrokeWidth
                                    className={isLiked ? "me-2 text-blue-600" : "me-2"}
                                />
                                {likes}
                                {/* {post.likes} */}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
