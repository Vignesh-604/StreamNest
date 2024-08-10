import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [channelName, setChannelName] = useState("");
    const [sortType, setSortType] = useState("desc");
    const [sortBy, setSortBy] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const submitSearch = () => {
        const params = new URLSearchParams();
        if (query) params.append("query", query);
        if (channelName) params.append("name", channelName);
        if (sortType && sortBy !== "") params.append("sortType", sortType);
        if (sortBy) params.append("sortBy", sortBy);

        navigate(`?${params.toString()}`);
        // for (let x of params.entries()) console.log(x);
        setIsDropdownOpen(false)
    };

    return (
        <div className="flex flex-grow items-center justify-center">
            <div className="flex items-center rounded-full bg-gray-900 p-2 w-full max-w-lg mx-6 relative">
                <input
                    type="text"
                    className="flex-grow bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            submitSearch();
                        }
                    }}
                />
                <button title="Search"
                    className="flex items-center justify-center h-10 w-10 bg-gray-800 rounded-full"
                    onClick={submitSearch}
                >
                    <MagnifyingGlassIcon className="h-5 w-5 text-white" />
                </button>

                <div className="relative ml-2">
                    <button title="Filter"
                        className="flex items-center justify-center h-10 w-10 bg-gray-800 rounded-full"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <ChevronDownIcon className="h-5 w-5 text-white" />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-12 mt-2 w-64 border border-gray-700 bg-gray-900 p-4 rounded-lg shadow-lg z-10">
                            <div className="mb-4">
                                <label className="text-white text-sm">Channel Name</label>
                                <input
                                    type="text"
                                    className="bg-gray-800 text-white p-2 rounded w-full outline-none"
                                    placeholder="Enter channel name"
                                    value={channelName}
                                    onChange={(e) => setChannelName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-white text-sm mb-1">Sort By</label>
                                <select
                                    className="bg-gray-800 text-white p-2 rounded w-full outline-none"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="">Default</option>
                                    <option value="likes">Likes</option>
                                    <option value="duration">Duration</option>
                                    <option value="views">Views</option>
                                </select>
                            </div>
                            <div className="mt-4">
                                <label className="text-white text-sm mb-1">Sort Type</label>
                                <div className="flex items-center space-x-4">
                                    <label className={`text-sm ${sortBy === "" ? "text-gray-500" : "text-white"}`}>
                                        <input
                                            type="radio"
                                            value="desc"
                                            checked={sortType === "desc"}
                                            onChange={(e) => setSortType(e.target.value)}
                                            className="mr-2"
                                            disabled={sortBy === ""}
                                        />
                                        Descending
                                    </label>
                                    <label className={`text-sm ${sortBy === "" ? "text-gray-500" : "text-white"}`}>
                                        <input
                                            type="radio"
                                            value="asc"
                                            checked={sortType === "asc"}
                                            onChange={(e) => setSortType(e.target.value)}
                                            className="mr-2"
                                            disabled={sortBy === ""}
                                        />
                                        Ascending
                                    </label>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
