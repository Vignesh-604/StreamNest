import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Profile from './components/Profile'
import Channel from './components/Channel'
import Post from "./components/Post/Post"
import Playlist from './components/Playlist/Playlist'
import LikedVideos from "./components/Video/LikedVideos"
import Playlists from './components/Playlist/Playlists.jsx'
import { ErrorPage } from './components/ErrorPage.jsx'
import PostList from './components/Post/PostList.jsx'
import Subscriptions from './components/Subscription/Subsciptions.jsx'

const router = createBrowserRouter(         // For web applications
    createRoutesFromElements(
        <Route path='/' element={<App />}>

            <Route index element={<Profile />} />

            <Route path='/channel' element={<Channel />} />
            <Route path='/channel/:channelId' element={<Channel />} />
            
            <Route path='/liked' element={<LikedVideos />} />
            <Route path='/subscriptions' element={<Subscriptions />} />

            <Route path='/playlist' element={<Playlists />} />
            <Route path='/playlist/:id' element={<Playlist />} />

            <Route path='/post' element={<PostList />} />
            <Route path='/post/:postId' element={<Post />} />
            
            <Route path='*' element={<ErrorPage />} />

        </Route>
    ))

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
