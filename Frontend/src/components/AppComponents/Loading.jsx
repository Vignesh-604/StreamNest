import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';

export default function Loading({ auth = false, loader = {} }) {
    const [timer, setTimer] = useState(60);
    const { setLoading } = loader;

    useEffect(() => {
        if (auth && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        }

        // When timer reaches 0, set loading to false
        if (auth && timer === 0 && setLoading) {
            setLoading(false);
        }
    }, [auth, timer, setLoading]);

    if (auth) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 p-8 min-h-[300px]">
                <div className="flex items-center space-x-4">
                    <ReactLoading type="bubbles" width={50} height={50} color="#a855f7" />
                    <h1 className="text-2xl font-semibold text-white">Authenticating credentials</h1>
                </div>

                <p className="text-gray-300 text-lg">Please wait for a moment...</p>

                <div className="flex flex-col items-center space-y-2">
                    <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-500 transition-all duration-1000"
                            style={{ width: `${(timer / 60) * 100}%` }}
                        />
                    </div>
                    <p className="text-gray-400">
                        Maximum wait time: <span className="text-purple-400 font-medium">{timer}s</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mt-30 text-2xl">
            <ReactLoading type="spin" width={100} className="mb-10" />
            <h1>Loading data...</h1>
        </div>
    );
}