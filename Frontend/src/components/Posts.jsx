import { useState, useEffect } from 'react';
import img from "../assets/profile.webp";
import Cookies from "js-cookie";
import axios from 'axios';
import { MessageSquareText, ThumbsUpIcon } from 'lucide-react';
import { parseDate } from './utility';

export default function PostList({ channelId = "", owner }) {

    const [posts, setPosts] = useState([]);
    const id = channelId === "" ? (JSON.parse(Cookies.get("user")))._id : channelId;

    useEffect(() => {
        axios.get(`/api/post/user/${id}`)
            .then((res) => setPosts(res.data.data))
            .catch(error => console.log(error));
    }, []);

    return (
        <div className=" max-w-7xl">
            <h1 className="font-bold text-start text-5xl mt-7 mb-10 mx-2">Posts</h1>
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center">
                    {
                        posts.length !== 0 ? (
                            posts.map((post, index) => (
                                <div key={index} className="bg-gray-800 text-white p-4 rounded-lg mb-4 shadow-md w-full">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={owner.avatar}
                                            alt={`${owner.fullname} avatar`}
                                            onError={e => e.target.src = img}
                                            className="h-10 w-10 rounded-full object-cover mr-3"
                                        />
                                        <div>
                                            <div className="font-semibold">{owner.fullname}</div>
                                            <div className="text-sm text-gray-400">{parseDate(post.updatedAt)}</div>
                                        </div>
                                    </div>
                                    <div className="mb-4 whitespace-pre-line">{post.content}</div>
                                    <div className="flex text-gray-400">
                                        <div className="flex items-center mr-4">
                                            <span className="flex items-center mr-2 cursor-pointer">
                                                <ThumbsUpIcon className='me-2' />531
                                                {/* {post.likes} */}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="flex items-center cursor-pointer">
                                                <MessageSquareText className='me-2' />89
                                                {/* {post.comments} */}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h1 className="font-bold text-center text-3xl mt-7">You have no posts</h1>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
