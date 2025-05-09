import React, { useEffect, useState } from 'react';
import profile from "../assets/profile.webp";
import axios from 'axios';
import { PenBoxIcon, Plus, X } from 'lucide-react';
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { parseDate, showCustomAlert } from '../Utils/utility';
import Loading from '../AppComponents/Loading';

export default function PostConfig() {
    const user = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const editMode = location.pathname.includes("/post/edit");
    const [loading, setLoading] = useState(true);
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
                        setTimeout(() => {
                            showCustomAlert("Post edited");
                        }, 500);
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
                        setTimeout(() => {
                            showCustomAlert("Post created");
                        }, 500);
                        navigate(-1);
                    })
                    .catch(error => console.log(error.response.data));
            }
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="flex justify-center items-center w-full mt-10">
            {post ? (
                <div className="bg-gray-900 w-[500px] md:w-[750px] lg:w-[1000px] text-white p-6 rounded-lg mb-6 shadow-lg border border-purple-500/20">
                    <div className="flex items-center mb-6 justify-between">
                        <div className="flex items-center">
                            <img
                                src={post.owner[0].avatar ? post.owner[0].avatar : profile}
                                alt="Profile"
                                onError={e => e.target.src = profile}
                                className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-purple-500/30"
                            />
                            <div>
                                <span className="font-semibold text-lg text-purple-100">
                                    {post.owner[0].fullname}
                                </span>
                                <span className="font-normal ml-2 text-gray-400">
                                    @{post.owner[0].username}
                                </span>
                                {editMode ? (
                                    <div className="text-sm text-gray-400/70">
                                        Last updated on: {parseDate(post.updatedAt)}
                                    </div>
                                ) : (
                                    <div className="text-sm text-purple-400/70">New post</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <textarea
                        className="mb-6 w-full p-4 bg-gray-800 text-white rounded-lg 
                                 border border-purple-500/20 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500/40 
                                 placeholder-purple-400/50 resize-none"
                        rows="10"
                        placeholder="Write your post..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className="flex justify-end items-center pe-4">
                        <div className="flex items-center space-x-6">
                            <button
                                className="flex items-center px-4 py-2 rounded-full
                                         text-purple-400 hover:text-purple-300 
                                         hover:bg-purple-500/10 transition-colors"
                                onClick={() => navigate(-1)}
                            >
                                <X strokeWidth={3} absoluteStrokeWidth className="mr-2" />
                                Cancel
                            </button>
                            <button
                                className="flex items-center px-4 py-2 rounded-full
                                         text-purple-400 hover:text-purple-300
                                         hover:bg-purple-500/10 transition-colors"
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
                <h1 className="text-xl font-semibold text-purple-100">No Post Found</h1>
            )}
        </div>
    );
}
