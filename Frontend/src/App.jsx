import Navbar from './components/Navbar'
import VideoItem from './components/VideoItem'
import LikedVideos from './components/LikedVideos'
import Playlists from './components/Playlists'
import axios from 'axios'
import Cookies from "js-cookie"
function App() {
        axios.post("/api/users/login",{
            username: "bobo",
            email: "bob@gmail.com",
            password: "12345678"
          }
          )
        .then((res) => {
          let userDetails = res.data.data.user
          Cookies.set("user", JSON.stringify(userDetails))
        })
        .catch(error => console.log(error))
        // console.log("Cookies:",Cookies.get("user"))
  return (
    <>
    <Navbar />
    <div className=' min-w-3xl'>
      {/* <LikedVideos /> */}
      <Playlists/>
      {/* <h1>Welcome to StreamNest</h1> */}
    </div>
    </>
  )
}

export default App
