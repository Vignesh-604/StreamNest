import Navbar from './components/Navbar'
import VideoItem from './components/VideoItem'
import LikedVideos from './components/LikedVideos'
import Playlists from './components/Playlists'
import axios from 'axios'
import Cookies from "js-cookie"
import { Sidebar } from './components/Sidebar'

function App() {
  // axios.post("/api/users/login",{
  //     username: "bobo",
  //     email: "bob@gmail.com",
  //     password: "12345678"
  //   }
  //   )
  // .then((res) => {
  //   let userDetails = res.data.data.user
  //   Cookies.set("user", JSON.stringify(userDetails))
  // })
  // .catch(error => console.log(error))

  return (
    <div className='flex justify-center'>
      <Navbar />
      {/* <Sidebar /> */}
      {/* <div className=' ml-64 p-8'> */}
      <div className='mt-36'>
        <Playlists />
        <LikedVideos/>
      </div>
    </div>
  )
}

export default App
