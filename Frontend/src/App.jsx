import Navbar from './components/Navbar'
import axios from 'axios'
import Cookies from "js-cookie"
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function App() {
  const navigate = useNavigate()

  const user = Cookies.get("user") ? true : false
  // console.log(user)

  useEffect(() => {
    if (!user) navigate("/signin")
  }, [])

  if (!user) return <Outlet />

  return (
    <div className='flex justify-center'>
      <Navbar />
      <div className='mt-36'>
        <Outlet context={JSON.parse(Cookies.get("user"))} />
      </div>
    </div>
  )
}

export default App
