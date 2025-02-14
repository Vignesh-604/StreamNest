import Cookies from "js-cookie"
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './components/AppComponents/Sidebar'

function App() {
  const navigate = useNavigate()

  const user = Cookies.get("user") ? true : false
  // console.log(user)

  useEffect(() => {
    if (!user) navigate("/")
  }, [])

  if (!user) return <Outlet />

  return (
    <div className='tracking-wider'>
      <Sidebar />
    </div>
  )
}

export default App
