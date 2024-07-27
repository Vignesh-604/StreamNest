import Navbar from './components/Navbar'
import VideoItem from './components/VideoItem'
import LikedVideos from './components/LikedVideos'

function App() {

  return (
    <>
    <Navbar />
    <div className='mx-14'>
      <LikedVideos />
      {/* <h1>Welcome to StreamNest</h1> */}
    </div>
    </>
  )
}

export default App
