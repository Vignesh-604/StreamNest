import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Profile from './components/Account/Profile'
import Channel from './components/Account/Channel'
import Post from "./components/Post/Post"
import Playlist from './components/Playlist/Playlist'
import LikedVideos from "./components/Video/LikedVideos"
import Playlists from './components/Playlist/Playlists.jsx'
import ErrorPage from './components/AppComponents/ErrorPage.jsx'
import Subscriptions from './components/Subscription/Subsciptions.jsx'
import Home from './components/Home.jsx'
import PostConfig from './components/Post/PostConfig.jsx'
import EditVideo from './components/Video/EditVideo.jsx'
import NewVideo from './components/Video/NewVideo.jsx'
import WatchHistory from './components/Video/WatchHistory.jsx'
import VideoPlayer from './components/Video/VideoPlayer.jsx'
import LandingPage from './components/Account/LandingPage.jsx'
import Subscribers from './components/Subscription/Subscribers.jsx'
import PostList from './components/Post/PostList.jsx'
import ChannelVideos from './components/Video/ChannelVideos.jsx'
import UserDetails from './components/Account/UserDetails.jsx'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>

            <Route index element={<LandingPage />} />
            <Route path='/home' element={<Home />} />
            <Route path='/profile' element={<Profile />} />

            <Route path='/channel' element={<UserDetails />} />
            <Route path='/channel/:channelId' element={<UserDetails />} />

            <Route path='/videos' element={<ChannelVideos/>} />
            <Route path='/video/edit/:videoId' element={<EditVideo />} />
            <Route path='/video/new' element={<NewVideo />} />
            <Route path='/video/watch/:videoId' element={<VideoPlayer />} />
            
            <Route path='/liked' element={<LikedVideos />} />
            <Route path='/subscriptions' element={<Subscriptions />} />
            <Route path='/subscribers' element={<Subscribers />} />
            <Route path='/history' element={<WatchHistory />} />

            <Route path='/playlist' element={<Playlists />} />
            <Route path='/playlist/:id' element={<Playlist />} />

            <Route path='/posts' element={<PostList />} />
            <Route path='/posts/:channelId' element={<PostList />} />
            <Route path='/posts/:channelId/p/:postId' element={<Post />} />

            <Route path='/posts/p/:postId' element={<Post />} />
            <Route path='/post/new' element={<PostConfig />} />
            <Route path='/post/edit/:postId' element={<PostConfig />} />
            
            <Route path='*' element={<ErrorPage />} />

        </Route>
    ))

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)