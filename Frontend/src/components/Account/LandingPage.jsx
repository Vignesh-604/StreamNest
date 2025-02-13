import React, { useState } from 'react';
import SignIn from './SignIn';
import Register from './Register';
import { Video, CheckCircle, Play } from 'lucide-react';

export default function LandingPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      <div className="max-md:hidden relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
        <div className="absolute inset-0">
          <img
            className="h-full w-full rounded-md object-cover object-top"
            src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d"
            alt="Content creator workspace"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="relative">
          <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">
            <h3 className="text-4xl font-bold text-white">
              Share your creativity with the world
            </h3>
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Video className="h-6 w-6 text-purple-500" />
                  <span className="text-xl font-semibold text-white">For Creators</span>
                </div>
                <ul className="space-y-3">
                  {["High-quality video hosting", "Powerful creator tools", "Engage with your audience"].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-500" />
                      <span className="text-lg text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Play className="h-6 w-6 text-purple-500" />
                  <span className="text-xl font-semibold text-white">For Viewers</span>
                </div>
                <ul className="space-y-3">
                  {["Unlimited HD streaming", "Personalized recommendations", "Interactive community"].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-500" />
                      <span className="text-lg text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-2">
        {showRegister ? (
          <Register onSwitchToSignIn={() => setShowRegister(false)} />
        ) : (
          <SignIn onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    </div>
  );
}
