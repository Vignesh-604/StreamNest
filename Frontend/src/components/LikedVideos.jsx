import VideoItem from "./VideoItem"
import thumbnail from "../assets/thumbnail.jpeg"
import { useEffect, useState } from "react"
import axios from "axios"

export default function LikedVideos() {
    const title = "Hello"
    const description = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti, quisquam nisi? Expedita, hic recusandae. Obcaecati molestias et vitae earum. Sit maxime, ratione pariatur reiciendis ex placeat voluptates corporis veniam magni!"
    const owner = "Dude"
    const views = 30

    let [videos, setVideos] = useState([])

    useEffect(() => {
        // axios.post("/api/users/login",{
        //     username: "bobo",
        //     email: "bob@gmail.com",
        //     password: "12345678"
        //   }
        //   )
        // .then((res) => console.log(res))
        // .catch(error => console.log(error))

        axios.get("/api/like/likedVideos")
            .then((res) => setVideos(res.data.data))
            .catch(error => console.log(error))
    }, [])
    console.log(videos);

    return (
        <>
            <h1 className="flex ms-32 font-bold text-5xl my-7">Liked Videos</h1>
            {
                videos.map((vid) => (

                    <div key={vid._id}>
                        <VideoItem 
                        title={vid.videos[0].title} 
                        description={vid.videos[0].description} 
                        owner={vid.videos[0].owner[0].username} 
                        views={vid.videos[0].views} 
                        thumbnail={vid.videos[0].thumbnail} 
                        />
                    </div>
                ))
            }
        </>
    )
}