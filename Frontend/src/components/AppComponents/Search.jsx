import { SearchIcon, ArrowDownWideNarrow, ArrowUpNarrowWide, Users, X, Filter } from "lucide-react";
import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";

// Custom hook to preserve input focus
function usePersistentInput(initialValue = "") {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef(null);

    const onChange = useCallback((e) => {
        setValue(e.target.value);
        // Ensure focus stays on the input
        if (inputRef.current) {
            const currentPos = e.target.selectionStart;
            // Use setTimeout to ensure the selection happens after React's state update
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.setSelectionRange(currentPos, currentPos);
                }
            }, 0);
        }
    }, []);

    return [value, onChange, inputRef, setValue];
}

// Memoized search input component
const SearchInput = memo(({ value, onChange, placeholder, onKeyDown, inputRef }) => {
    return (
        <input
            ref={inputRef}
            type="text"
            className="flex-grow bg-transparent tracking-wider text-white outline-none placeholder-gray-500"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoComplete="off"
        />
    );
});

// Memoized channel input component
const ChannelInput = memo(({ value, onChange, placeholder, onKeyDown, inputRef }) => {
    return (
        <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent tracking-wider text-white outline-none placeholder-gray-500"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoComplete="off"
        />
    );
});

// Main Search component wrapped in memo to prevent unnecessary re-renders
const Search = memo(function Search() {
    const navigate = useNavigate();
    const [query, onQueryChange, queryInputRef, setQuery] = usePersistentInput("");
    const [channelName, onChannelChange, channelInputRef, setChannelName] = usePersistentInput("");
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

    const submitSearch = useCallback(() => {
        const params = new URLSearchParams();
        if (query.trim()) params.append("query", query);
        if (channelName) params.append("name", channelName);
        if (sortType && sortBy !== "") params.append("sortType", sortType);
        if (sortBy) params.append("sortBy", sortBy);
        navigate(`home?${params.toString()}`);
        setIsDialogOpen(false);
    }, [query, channelName, sortType, sortBy, navigate]);

    const clearSearch = useCallback(() => {
        setQuery("");
        // Ensure focus is maintained
        if (queryInputRef.current) {
            setTimeout(() => {
                queryInputRef.current.focus();
            }, 0);
        }
    }, [setQuery, queryInputRef]);

    const handleSortByChange = useCallback((e) => {
        setSortBy(e.target.value);
    }, []);

    const toggleSortType = useCallback(() => {
        if (sortBy !== "") {
            setSortType(prevType => prevType === "desc" ? "asc" : "desc");
        }
    }, [sortBy]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            submitSearch();
        }
    }, [submitSearch]);

    // Mobile Search Dialog - Memoized
    const MobileDialog = useCallback(() => (
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
                        <SearchInput 
                            value={query}
                            onChange={onQueryChange}
                            placeholder="Search for videos..."
                            onKeyDown={handleKeyDown}
                            inputRef={queryInputRef}
                        />
                    </div>
                </div>

                {/* Channel Filter */}
                <div className="space-y-1">
                    <label className="text-sm text-gray-400">Channel</label>
                    <div className="flex items-center rounded-lg bg-gray-900 px-3 py-2 border border-gray-700">
                        <Users className="h-5 w-5 text-gray-400 mr-2" />
                        <ChannelInput 
                            value={channelName}
                            onChange={onChannelChange}
                            placeholder="Enter channel name"
                            onKeyDown={handleKeyDown}
                            inputRef={channelInputRef}
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
                            onChange={handleSortByChange}
                        >
                            <option value="">Sort by</option>
                            <option value="likes">Likes</option>
                            <option value="duration">Duration</option>
                            <option value="views">Views</option>
                        </select>

                        <button
                            className={`p-2 rounded-lg border border-gray-700 ${sortBy === "" ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
                            onClick={toggleSortType}
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
    ), [query, channelName, sortBy, sortType, onQueryChange, onChannelChange, handleSortByChange, toggleSortType, submitSearch, handleKeyDown, queryInputRef, channelInputRef]);

    // Desktop Search Bar - Memoized
    const DesktopSearch = useCallback(() => (
        <div className="flex items-center gap-2 w-full">
            {/* Search Input with reduced width and clear/search buttons */}
            <div className="flex items-center rounded-lg bg-gray-900 px-3 py-2 w-3/5 border max-md:w-full border-gray-700">
                <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />
                <SearchInput 
                    value={query}
                    onChange={onQueryChange}
                    placeholder="Search"
                    onKeyDown={handleKeyDown}
                    inputRef={queryInputRef}
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
                <ChannelInput 
                    value={channelName}
                    onChange={onChannelChange}
                    placeholder="Channel"
                    onKeyDown={handleKeyDown}
                    inputRef={channelInputRef}
                />
            </div>

            {/* Sort Options */}
            <select
                className="hidden md:block rounded-lg bg-gray-900 px-3 py-2 text-white border border-gray-700 outline-none cursor-pointer"
                value={sortBy}
                onChange={handleSortByChange}
            >
                <option value="">Sort by</option>
                <option value="likes">Likes</option>
                <option value="duration">Duration</option>
                <option value="views">Views</option>
            </select>

            {/* Sort Direction Toggle */}
            <button
                className={`hidden md:block p-2 rounded-lg border border-gray-700 ${sortBy === "" ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
                onClick={toggleSortType}
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
    ), [query, channelName, sortBy, sortType, onQueryChange, onChannelChange, handleSortByChange, toggleSortType, submitSearch, clearSearch, handleKeyDown, queryInputRef, channelInputRef]);

    return (
        <>
            <DesktopSearch />
            {isDialogOpen && <MobileDialog />}
        </>
    );
});

export default Search;