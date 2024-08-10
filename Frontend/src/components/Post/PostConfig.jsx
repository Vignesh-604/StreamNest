import React, { useEffect, useState } from 'react';
import profile from "../assets/profile.webp";
import axios from 'axios';
import { PenBoxIcon, Plus, X } from 'lucide-react';
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { parseDate } from '../utility';
import Loading from '../AppComponents/Loading';

export default function PostConfig() {

    const user = useOutletContext();
    const navigate = useNavigate();

    const location = useLocation();
    const editMode = location.pathname.includes("/post/edit");

    const [loading, setLoading] = useState(true);  // Add loading state

    const [post, setPost] = useState(null);
    const [content, setContent] = useState("");
    const [currContent, setCurrContent] = useState("");
    const { postId } = useParams();

    useEffect(() => {
        if (editMode) {
            axios.get(`/api/post/${postId}`)  // To edit post
                .then((res) => {
                    const postDetails = res.data.data;
                    if (postDetails.owner[0]?._id !== user._id) {
                        navigate(-1);
                    } else {
                        setPost(postDetails);
                        setContent(postDetails.content);
                        setCurrContent(postDetails.content);
                    }
                    setLoading(false);  // Set loading to false after data is fetched
                })
                .catch(error => {
                    console.log(error);
                    setLoading(false);  // Set loading to false on error as well
                });
        }

        else {                                  // For new post
            setPost({
                owner: [{
                    avatar: user.avatar,
                    fullname: user.fullname,
                    username: user.username,
                }]
            });
            setLoading(false);  // Set loading to false for new post
        }
    }, []);

    const config = () => {
        if (editMode) {
            if (content !== currContent) {
                axios.post(`/api/post/${postId}`, { content })
                    .then(res => {
                        console.log(res);
                        navigate(-1);
                    })
                    .catch(error => console.log(error));
            } else {
                navigate(-1);
            }
        }

        else {
            if (!content || content.trim()) {
                axios.post(`/api/post/new`, { content })
                    .then(res => {
                        console.log(res);
                        navigate(-1);
                    })
                    .catch(error => console.log(error.response.data));
            }
        }
    };

    // Handle loading state
    if (loading) return <Loading />;

    return (
        <>
            {
                post ? (
                    <div className="bg-gray-800 w-[500px] md:w-[750px] lg:w-[1000px] text-white p-6 rounded-lg mb-6 shadow-md">
                        <div className="flex items-center mb-4 justify-between">
                            <div className='flex items-center'>
                                <img
                                    src={post.owner[0].avatar ? post.owner[0].avatar : profile}
                                    alt="Profile"
                                    onError={e => e.target.src = profile}
                                    className="h-12 w-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <span className="font-semibold text-lg">{post.owner[0].fullname}</span>
                                    <span className="font-normal ml-2 text-gray-400">@{post.owner[0].username}</span>
                                    {
                                        editMode ? (
                                            <div className="text-sm text-gray-400">
                                                Last updated on: {parseDate(post.updatedAt)}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-400">New post</div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <textarea
                            className="mb-4 w-full p-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 resize-none"
                            rows="10"
                            placeholder="Write your post..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <div className="flex justify-end items-center pe-4 text-gray-400">
                            <div className="flex items-center space-x-10">
                                <button
                                    className="flex items-center text-gray-400 hover:text-white"
                                    onClick={() => navigate(-1)}
                                >
                                    <X strokeWidth={3} absoluteStrokeWidth className="" />
                                    Cancel
                                </button>
                                <button
                                    className="flex items-center text-gray-400 hover:text-white"
                                    onClick={config}
                                >
                                    {editMode ? (
                                        <>
                                            <PenBoxIcon strokeWidth={2} absoluteStrokeWidth className="mr-2" />
                                            Save Changes
                                        </>
                                    ) : (
                                        <>
                                            <Plus strokeWidth={2} absoluteStrokeWidth className="mr-2" />
                                            Create Post
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <h1>No Post Found</h1>  // This block handles the case where there's no post data
                )
            }
        </>
    );
}
