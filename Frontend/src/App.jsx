import Navbar from './components/Navbar'
import axios from 'axios'
import Cookies from "js-cookie"
import { Outlet } from 'react-router-dom'

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

      <div className='mt-36'>
        <Outlet context={JSON.parse(Cookies.get("user"))}/>
      </div>
    </div>
  )
}

export default App
