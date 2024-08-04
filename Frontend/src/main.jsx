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

const router = createBrowserRouter(         // For web applications
    createRoutesFromElements(
        <Route path='/' element={<App />}>

            <Route index element={<Profile />} />
            <Route path='/channel' element={<Channel />} />
            <Route path='/liked' element={<LikedVideos />} />
            <Route path='/playlist' element={<Playlists />} />

        </Route>
    ))

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
