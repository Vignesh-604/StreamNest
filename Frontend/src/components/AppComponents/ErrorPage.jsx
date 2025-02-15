import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, WifiOff } from "lucide-react";

export default function ErrorPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            navigate("/home"); // Automatically go back when online
        };
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [navigate]);

    // If offline, show "No Internet" UI
    if (isOffline) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <WifiOff className="w-52 h-52 mb-6"/>
                <h1 className="text-4xl font-bold mb-4">No Internet Connection</h1>
                <p className="text-lg text-gray-400 mb-6">
                    You are offline. Please check your network and try again.
                </p>
                <Link to="/home" className="bg-purple-500 text-white px-4 py-2 rounded-lg">
                    Retry
                </Link>
            </div>
        );
    }

    // Handle 404 (Invalid Page) case
    return (
        <div className="py-10 flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <p className="text-[10rem] font-bold tracking-wider ">404</p>
            <h1 className=" text-3xl font-bold tracking-tight sm:text-5xl">
                Page not found
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-400">
                Sorry, we couldn't find the page you're looking for.
            </p>
            <div className="mt-4 flex items-center justify-center gap-x-3">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center rounded-md border border-white px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Go back
                </button>
                <Link
                    to="/home"
                    className="rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-600"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
