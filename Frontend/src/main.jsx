import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

import App from './App.jsx'
import './index.css'

// Account-related components
import LandingPage from './components/Account/LandingPage.jsx'
import UserDetails from './components/Account/UserDetails.jsx'

// App components
import ErrorPage from './components/AppComponents/ErrorPage.jsx'
import Home from './components/AppComponents/Home.jsx'
import PurchaseHistory from './components/AppComponents/PurchaseHistory.jsx'

// Video components
import VideoPlayer from './components/Video/VideoPlayer.jsx'
import EditVideo from './components/Video/EditVideo.jsx'
import NewVideo from './components/Video/NewVideo.jsx'
import BuyVideo from './components/Video/BuyVideo.jsx'
import WatchHistory from './components/Video/WatchHistory.jsx'
import LikedVideos from './components/Video/LikedVideos.jsx'
import ChannelVideos from './components/Video/ChannelVideos.jsx'

// Subscription components
import Subscribers from './components/Subscription/Subscribers.jsx'
import Subscriptions from './components/Subscription/Subsciptions.jsx'

// Playlist components
import Playlists from './components/Playlist/Playlists.jsx'
import Playlist from './components/Playlist/Playlist.jsx'

// Post components
import Post from './components/Post/Post.jsx'
import PostList from './components/Post/PostList.jsx'
import PostConfig from './components/Post/PostConfig.jsx'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index element={<LandingPage />} />
            <Route path='/home' element={<Home />} />

            {/* Channel Routes */}
            <Route path='/channel' element={<UserDetails />} />
            <Route path='/channel/:channelId' element={<UserDetails />} />

            {/* Video Routes */}
            <Route path='/videos' element={<ChannelVideos />} />
            <Route path='/videos/:channelId' element={<ChannelVideos />} />
            <Route path='/video/edit/:videoId' element={<EditVideo />} />
            <Route path='/video/new' element={<NewVideo />} />
            <Route path='/video/buy/:videoId' element={<BuyVideo />} />
            <Route path='/video/watch/:videoId' element={<VideoPlayer />} />
            <Route path='/liked' element={<LikedVideos />} />
            <Route path='/history' element={<WatchHistory />} />
            <Route path='/purchases' element={<PurchaseHistory />} />

            {/* Subscription Routes */}
            <Route path='/subscriptions' element={<Subscriptions />} />
            <Route path='/subscribers' element={<Subscribers />} />

            {/* Playlist Routes */}
            <Route path='/playlist/' element={<Playlists />} />
            <Route path='/playlist/u/:channelId' element={<Playlists />} />
            <Route path='/playlist/p/:id' element={<Playlist />} />
            <Route path='/playlist/u/:channelId/p/:id' element={<Playlist />} />

            {/* Post Routes */}
            <Route path='/post' element={<PostList />} />
            <Route path='/post/u/:channelId' element={<PostList />} />
            <Route path='/post/u/:channelId/p/:postId' element={<Post />} />
            <Route path='/post/p/:postId' element={<Post />} />
            <Route path='/post/new' element={<PostConfig />} />
            <Route path='/post/edit/:postId' element={<PostConfig />} />

            {/* Error Page */}
            <Route path='*' element={<ErrorPage />} />
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
