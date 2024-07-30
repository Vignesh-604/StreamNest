import Navbar from './components/Navbar'
import VideoItem from './components/VideoItem'
import LikedVideos from './components/LikedVideos'
import Playlists from './components/Playlists'

function App() {
        // axios.post("/api/users/login",{
        //     username: "bobo",
        //     email: "bob@gmail.com",
        //     password: "12345678"
        //   }
        //   )
        // .then((res) => console.log(res))
        // .catch(error => console.log(error))
  return (
    <>
    <Navbar />
    <div className=' min-w-3xl'>
      <LikedVideos />
      <Playlists/>
      {/* <h1>Welcome to StreamNest</h1> */}
    </div>
    </>
  )
}

export default App
