import { SearchIcon, ArrowDownWideNarrow, ArrowUpNarrowWide, Users, X, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [channelName, setChannelName] = useState("");
    const [sortType, setSortType] = useState("desc");
    const [sortBy, setSortBy] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Close dialog when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsDialogOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const submitSearch = () => {
        const params = new URLSearchParams();
        if (query.trim()) params.append("query", query);
        if (channelName) params.append("name", channelName);
        if (sortType && sortBy !== "") params.append("sortType", sortType);
        if (sortBy) params.append("sortBy", sortBy);
        navigate(`home?${params.toString()}`);
        setIsDialogOpen(false);
    }

    const clearSearch = () => {
        setQuery("");
    }

    // Mobile Search Dialog
    const MobileDialog = () => (
        <div className="fixed inset-0 z-50 bg-gray-950/95 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <h2 className="text-white text-lg font-semibold">Search</h2>
                <button onClick={() => setIsDialogOpen(false)} className="text-white">
                    <X className="h-6 w-6 cursor-pointer" />
                </button>
            </div>

            <div className="flex-1 space-y-4 px-4 bg-gray-900/50">
                {/* Search Input */}
                <div className="space-y-1">
                    <label className="text-sm text-gray-400">Search</label>
                    <div className="flex items-center rounded-lg bg-gray-900 px-3 py-2 border border-gray-700">
                        <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            className="flex-grow bg-transparent tracking-wider text-white outline-none placeholder-gray-500"
                            placeholder="Search for videos..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Channel Filter */}
                <div className="space-y-1">
                    <label className="text-sm text-gray-400">Channel</label>
                    <div className="flex items-center rounded-lg bg-gray-900 px-3 py-2 border border-gray-700">
                        <Users className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            className="w-full bg-transparent tracking-wider text-white outline-none placeholder-gray-500"
                            placeholder="Enter channel name"
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-1">
                    <label className="text-sm text-gray-400">Sort</label>
                    <div className="flex gap-2">
                        <select
                            className="flex-grow rounded-lg bg-gray-900 px-3 py-2 text-white border border-gray-700 outline-none"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="">Sort by</option>
                            <option value="likes">Likes</option>
                            <option value="duration">Duration</option>
                            <option value="views">Views</option>
                        </select>

                        <button
                            className={`p-2 rounded-lg border border-gray-700 ${sortBy === "" ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
                            onClick={() => sortBy !== "" && setSortType(sortType === "desc" ? "asc" : "desc")}
                            disabled={sortBy === ""}
                        >
                            {sortType === "desc" ? (
                                <ArrowDownWideNarrow className="h-5 w-5 text-white" />
                            ) : (
                                <ArrowUpNarrowWide className="h-5 w-5 text-white" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-4 border-b border-gray-800">
                    <button
                        onClick={submitSearch}
                        className="w-full bg-purple-600 text-white rounded-lg py-2 px-4 hover:bg-purple-700 transition-colors"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );

    // Desktop Search Bar
    const DesktopSearch = () => (
        <div className="flex items-center gap-2 w-full">
            {/* Search Input with reduced width and clear/search buttons */}
            <div className="flex items-center rounded-lg bg-gray-900 px-3 py-2 w-3/5 border max-md:w-full border-gray-700">
                <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />
                <input
                    type="text"
                    className="flex-grow bg-transparent tracking-wider text-white outline-none placeholder-gray-500"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                />
                {query && (
                    <>
                        <button
                            onClick={clearSearch}
                            className="text-gray-400 hover:text-gray-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="mx-2 h-6 w-px bg-gray-700" />
                        <button
                            onClick={submitSearch}
                            className="text-gray-400 hover:text-gray-300"
                        >
                            <SearchIcon className="h-5 w-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Channel Filter with increased width */}
            <div className="hidden md:flex items-center rounded-lg bg-gray-900 px-3 py-2 border border-gray-700 flex-grow">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <input
                    type="text"
                    className="w-full bg-transparent tracking-wider text-white outline-none placeholder-gray-500"
                    placeholder="Channel"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                />
            </div>

            {/* Sort Options */}
            <select
                className="hidden md:block rounded-lg bg-gray-900 px-3 py-2 text-white border border-gray-700 outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="">Sort by</option>
                <option value="likes">Likes</option>
                <option value="duration">Duration</option>
                <option value="views">Views</option>
            </select>

            {/* Sort Direction Toggle */}
            <button
                className={`hidden md:block p-2 rounded-lg border border-gray-700 ${sortBy === "" ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
                onClick={() => sortBy !== "" && setSortType(sortType === "desc" ? "asc" : "desc")}
                disabled={sortBy === ""}
                title={sortType === "desc" ? "Descending" : "Ascending"}
            >
                {sortType === "desc" ? (
                    <ArrowDownWideNarrow className="h-5 w-5 text-white" />
                ) : (
                    <ArrowUpNarrowWide className="h-5 w-5 text-white" />
                )}
            </button>

            {/* Mobile Filter Button */}
            <button
                className="md:hidden p-2 rounded-lg border border-gray-700 hover:bg-gray-800"
                onClick={() => setIsDialogOpen(true)}
            >
                <Filter className="h-5 w-5 text-white" />
            </button>
        </div>
    );

    return (
        <>
            <DesktopSearch />
            {isDialogOpen && <MobileDialog />}
        </>
    );
}